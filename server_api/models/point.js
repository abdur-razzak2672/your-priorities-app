"use strict";

var async = require('async');
var queue = require('../active-citizen/workers/queue');
const log = require('../utils/logger');

var findCommunityAndDomainForPointFromGroup = function (sequelize, options, callback) {
  sequelize.models.Group.find({
    where: {
      id: options.group_id
    },
    include: [
      {
        model: sequelize.models.Community,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: sequelize.models.Domain,
            attributes: ['id'],
            required: true
          }
        ]
      }
    ]
  }).then(function (group) {
    if (group) {
      options.community_id = group.Community.id;
      options.domain_id = group.Community.Domain.id;
    }
    callback(null, options);
  }).catch(function (error) {
    callback(error);
  })
};

var attachEmptyGroupIfNeeded = function (sequelize, options, callback) {
  if (!options.group_id &&
    (options.domain_id || (options.community_id && options.communityAccess == sequelize.models.Community.ACCESS_PUBLIC))) {
    sequelize.models.Group.findOrCreate({where: { name: 'hidden_public_group_for_domain_level_points' },
      defaults: { access: sequelize.models.Group.ACCESS_PUBLIC }})
      .spread(function(group, created) {
        if (group) {
          options.group_id = group.id;
          callback(null, options);
        } else {
          callback("Can't create hidden public group for domain level points");
        }
      });
  } else {
    callback(null, options);
  }
};


var findGroupAndCommunityAndDomainForPointFromPost = function (sequelize, options, callback) {
  sequelize.models.Post.find({
    where: {
      id: options.post_id
    },
    include: [
      {
        model: sequelize.models.Group,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: sequelize.models.Community,
            attributes: ['id'],
            required: true,
            include: [
              {
                model: sequelize.models.Domain,
                attributes: ['id'],
                required: true
              }
            ]
          }
        ]
      }
    ]
  }).then(function (post) {
    options.group_id = post.Group.id;
    options.community_id = post.Group.Community.id;
    options.domain_id = post.Group.Community.Domain.id;
    callback(null, options);
  }).catch(function (error) {
    callback(error);
  })
};

var findDomainFromCommunity = function (sequelize, options, callback) {
  sequelize.models.Community.find({
    where: {
      id: options.community_id
    },
    attributes: ['id','access'],
    include: [
      {
        model: sequelize.models.Domain,
        attributes: ['id'],
        required: true
      }
    ]
  }).then(function (community) {
    options.domain_id = community.Domain.id;
    options.communityAccess = community.access;
    callback(null, options);
  }).catch(function (error) {
    callback(error);
  })
};

var setAllActivityGroupingIds = function (sequelize, options, callback) {
  async.series([
    function (seriesCallback) {
      if (options.post_id) {
        findGroupAndCommunityAndDomainForPointFromPost(sequelize, options, function (error, optionsIn) {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },

    function (seriesCallback) {
      if (options.group_id) {
        findCommunityAndDomainForPointFromGroup(sequelize, options, function (error, optionsIn) {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },

    function (seriesCallback) {
      if (options.community_id) {
        findDomainFromCommunity(sequelize, options, function (error, optionsIn) {
          if (optionsIn) {
            options = optionsIn;
          }
          seriesCallback(error);
        });
      } else {
        seriesCallback();
      }
    },

    // Attach an empty public group to domain and community levels to enable join on activities with group access control
    function (seriesCallback) {
      attachEmptyGroupIfNeeded(sequelize, options, function (error, optionsIn) {
        if (optionsIn) {
          options = optionsIn;
        }
        seriesCallback(error);
      });
    }
  ], function (error) {
    callback(error)
  });
};

module.exports = function(sequelize, DataTypes) {
  var Point = sequelize.define("Point", {
    name: { type: DataTypes.STRING, allowNull: true },
    content_type: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.INTEGER, allowNull: false },
    website: DataTypes.STRING,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    counter_revisions: { type: DataTypes.INTEGER, defaultValue: 1 },
    counter_quality_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_quality_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    embed_data: DataTypes.JSONB,
    data: DataTypes.JSONB,
    public_data: DataTypes.JSONB,
    language: { type: DataTypes.STRING, allowNull: true }
  }, {

    defaultScope: {
      where: {
        deleted: false,
        status: 'published'
      }
    },

    indexes: [
      {
        fields: ['post_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['public_data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['image_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['post_status_change_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['parent_point_id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['user_id','group_id','deleted']
      },
      {
        fields: ['user_id','group_id','deleted','status']
      },
      {
        fields: ['id','deleted','status']
      },
      {
        fields: ['post_id','deleted','status']
      }
    ],

    // Add following indexes manually for high throughput sites
    // CREATE INDEX pointaudio_idx_point_id ON "PointAudio" (point_id);
    // CREATE INDEX pointvideo_idx_point_id ON "PointVideo" (point_id);

    underscored: true,

    timestamps: true,

    tableName: 'points',

    instanceMethods: {
      setupModerationData: function () {
        if (!this.data) {
          this.set('data', {});
        }
        if (!this.data.moderation) {
          this.set('data.moderation', {});
        }
      },

      report: function (req, source, post, callback) {
        this.setupModerationData();
        async.series([
          function (seriesCallback) {

            if (!this.data.moderation.lastReportedBy) {
              this.set('data.moderation.lastReportedBy', []);
              if ((source==='user' || source==='fromUser') && !this.data.moderation.toxicityScore) {
                log.info("process-moderation point toxicity on manual report");
                queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: this.id }).priority('high').removeOnComplete(true).save();
              }
            }
            this.set('data.moderation.lastReportedBy',
              [{ date: new Date(), source: source, userId: (req && req.user) ? req.user.id : null, userEmail: (req && req.user) ? req.user.email : 'anonymous' }].concat(this.data.moderation.lastReportedBy)
            );

            this.save().then(function () {
              seriesCallback();
            }).catch(function (error) {
              seriesCallback(error);
            });
          }.bind(this),
          function (seriesCallback) {
            if (req && req.disableNotification===true) {
              seriesCallback();
            } else {
              sequelize.models.AcActivity.createActivity({
                type: 'activity.report.content',
                userId: (req && req.user) ? req.user.id : null,
                postId: post ? post.id : null,
                groupId: post ? post.Group.id : this.group_id,
                pointId: this.id,
                communityId: post ? post.Group.Community.id : null,
                domainId: post ? post.Group.Community.Domain.id : null
              }, function (error) {
                seriesCallback();
              });
            }
          }.bind(this)
        ], function (error) {
          this.increment('counter_flags');
          callback(error);
        }.bind(this));
      },
    },

    classMethods: {

      CONTENT_DEBATE: 0,
      CONTENT_NEWS_STORY: 1,
      CONTENT_COMMENT: 2,

      associate: function(models) {
        Point.belongsTo(sequelize.models.PostStatusChange);
        Point.belongsTo(sequelize.models.Post);
        Point.belongsTo(sequelize.models.Community);
        Point.belongsTo(sequelize.models.Domain);
        Point.belongsTo(sequelize.models.User);
        Point.belongsTo(sequelize.models.Image);
        Point.belongsTo(sequelize.models.Point, { as: 'ParentPoint' });
        Point.belongsTo(sequelize.models.Group);
        Point.hasMany(sequelize.models.PointRevision);
        Point.hasMany(sequelize.models.PointQuality);
        Point.belongsToMany(models.Video, { as: 'PointVideos', through: 'PointVideo' });
        Point.belongsToMany(models.Audio, { as: 'PointAudios', through: 'PointAudio' });
      },

      createComment: function (req, options, callback) {
        options.content = options.comment.content;
        delete options.comment;

        options.user_id = req.user.id;
        options.content_type = sequelize.models.Point.CONTENT_COMMENT;
        options.value = 0;
        options.status = 'published';
        options.user_agent = req.useragent.source;
        options.ip_address = req.clientIp;

        async.series([
          function (seriesCallback) {
            if (options.parent_point_id) {
              sequelize.models.Point.find({
                where: {
                  id: options.parent_point_id
                },
                attributes: ['id', 'group_id', 'post_id', 'community_id', 'domain_id']
              }).then(function (parentPoint) {
                if (parentPoint) {
                  options.group_id = parentPoint.group_id;
                  options.community_id = parentPoint.community_id;
                  options.domain_id = parentPoint.domain_id;
                  options.post_id = options.post_id ? options.post_id : parentPoint.post_id;
                }
                seriesCallback();
              }).catch(function (error) {
                seriesCallback(error);
              })
            } else {
              seriesCallback();
            }
          },

          function (seriesCallback) {
            if (options.image_id) {
              sequelize.models.Image.find({
                where: {
                  id: options.image_id
                },
                attributes: ['id', 'user_id' ],
                include: [
                  {
                    model: sequelize.models.Post,
                    as: 'PostUserImages',
                    attributes: ['id','group_id']
                  }
                ]
              }).then(function (image) {
                if (image && image.PostUserImages && image.PostUserImages.length>0) {
                  options.group_id = image.PostUserImages[0].group_id;
                  options.post_id = image.PostUserImages[0].id;
                }
                seriesCallback();
              }).catch(function (error) {
                seriesCallback(error);
              })
            } else {
              seriesCallback();
            }
          },

          function (seriesCallback) {
            setAllActivityGroupingIds(sequelize, options, function (error, optionsIn) {
              if (optionsIn) {
                options = optionsIn;
              }
              seriesCallback(error);
            });
          },

          function (seriesCallback) {
            sequelize.models.Point.build(options).save().then(function (point) {
              options.point_id = point.id;
              var pointRevision = sequelize.models.PointRevision.build(options);
              pointRevision.save().then(function () {
                log.info("process-moderation point toxicity on comment");
                queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }).priority('high').removeOnComplete(true).save();
                sequelize.models.AcActivity.createActivity({
                  type: 'activity.point.comment.new',
                  userId: options.user_id,
                  pointId: options.point_id,
                  imageId: options.image_id,
                  domainId: options.domain_id,
                  groupId: options.group_id ? options.group_id : 1,
                  communityId: options.community_id,
                  postId: options.post_id,
                  access: sequelize.models.AcActivity.ACCESS_PUBLIC
                }, function (error) {
                  seriesCallback(error);
                });
              })
            }).catch(function (error) {
              seriesCallback(error);
            });
          }
        ], function (error) {
          callback(error);
        });
      },

      createNewsStory: function (req, options, callback) {
        options.content = options.point.content;
        options.embed_data = options.point.embed_data;
        delete options.point;

        async.series([
          function (seriesCallback) {
            setAllActivityGroupingIds(sequelize, options, function (error, optionsIn) {
              if (optionsIn) {
                options = optionsIn;
              }
              seriesCallback(error);
            });
          }
        ], function (error) {
          options.user_id = req.user.id;
          options.content_type = sequelize.models.Point.CONTENT_NEWS_STORY;
          options.value = 0;
          options.status = 'published';
          options.user_agent = req.useragent.source;
          options.ip_address = req.clientIp;

          sequelize.models.Point.build(options).save().then(function (point) {
            options.point_id = point.id;
            var pointRevision = sequelize.models.PointRevision.build(options);
            pointRevision.save().then(function () {
              log.info("process-moderation point toxicity on news story");
              queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }).priority('high').removeOnComplete(true).save();
              sequelize.models.AcActivity.createActivity({
                type: 'activity.point.newsStory.new',
                userId: options.user_id,
                subType: options.subType ? options.subType : null,
                domainId: options.domain_id,
                groupId: options.group_id ? options.group_id : 1,
                pointId: options.point_id,
                communityId: options.community_id,
                postId: options.post_id,
                access: sequelize.models.AcActivity.ACCESS_PUBLIC
              }, function (error) {
                callback(error);
              });
            })
          }).catch(function (error) {
            callback(error);
          });
        });
      }
    }
  });

  return Point;
};
