"use strict";

const async = require("async");
const queue = require('../active-citizen/workers/queue');
const log = require('../utils/logger');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    content_type: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    official_status: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    status_changed_at: { type: DataTypes.DATE, allowNull: true },
    official_status_changed_at: { type: DataTypes.DATE, allowNull: true },
    counter_endorsements_up: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_endorsements_down: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_all_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_main_activities: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_impressions: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    data: DataTypes.JSONB,
    public_data: DataTypes.JSONB,
    position: DataTypes.INTEGER,
    location: DataTypes.JSONB,
    cover_media_type: DataTypes.STRING,
    legacy_post_id: DataTypes.INTEGER,
    user_interaction_profile: DataTypes.JSONB,
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
        name: 'posts_idx_deleted_status_id',
        fields: ['deleted', 'status','id']
      },
      {
        name: 'posts_idx_deleted_status',
        fields: ['deleted', 'status']
      },
      {
        name: 'published_by_official_status',
        fields: ['group_id', 'official_status', 'deleted'],
        where: {
          status: 'published'
        }
      },
      {
        name: 'published_by_official_status_w_category',
        fields: ['group_id', 'official_status', 'deleted', 'category_id'],
        where: {
          status: 'published'
        }
      },
      {
        name: 'all_statuses_by_official_status',
        fields: ['group_id', 'official_status','deleted','status']
      },
      {
        name: 'all_statuses_by_official_status_w_category',
        fields: ['group_id', 'official_status', 'deleted', 'status', 'category_id']
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
        fields: ['location'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['user_interaction_profile'],
        using: 'gin',
        operator: 'jsonb_path_ops'
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
        fields: ['id','deleted']
      },
      {
        fields: ['user_id','deleted','status']
      },
      {
        name: 'posts_idx_counter_points_group_id_deleted',
        fields: ['counter_points','group_id','deleted']
      },
      {
        name: 'posts_idx_created_at_group_id_deleted',
        fields: ['created_at','group_id','deleted']
      }
    ],

    // Add following indexes manually for high throughput sites
    // CREATE INDEX postaudio_idx_post_id ON "PostAudio" (post_id);
    // CREATE INDEX postvideo_idx_post_id ON "PostVideo" (post_id);
    // CREATE INDEX postheaderimage_idx_post_id ON "PostHeaderImage" (post_id);
    // CREATE INDEX posts_idx_counter_sum_group_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,deleted);
    // CREATE INDEX posts_idx_counter_sum_group_id_category_id_deleted ON posts ((counter_endorsements_up-counter_endorsements_down),group_id,category_id,deleted);

    scopes: {
      open: {
        where: {
          official_status: 0,
          deleted: false,
          status: 'published'
        }
      },
      not_open: {
        where: {
          official_status: {
            $in: [-2,-1,1,2]
          },
          deleted: false,
          status: 'published'
        }
      },
      finished: {
        where: {
          official_status: {
            $in: [-2, -1, 2]
          },
          deleted: false,
          status: 'published'
        }
      },
      successful: {
        where: {
          official_status: 2,
          deleted: false,
          status: 'published'
        }
      },
      compromised: {
        where: {
          official_status: -991,
          deleted: false,
          status: 'published'
        }
      },
      failed: {
        where: {
          official_status: {
            $in: [-2]
          },
          deleted: false,
          status: 'published'
        }
      },
      in_progress: {
        where: {
          official_status: {
            $in: [-1, 1]
          },
          deleted: false,
          status: 'published'
        }
      }
    },

    underscored: true,

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    tableName: 'posts'
  });

  Post.associate = (models) => {
    Post.hasMany(models.Point);
    Post.hasMany(models.Endorsement);
    Post.hasMany(models.PostRevision);
    Post.hasMany(models.Rating, { as: 'Ratings'});
    Post.belongsTo(models.Category, { foreignKey: 'category_id'});
    Post.belongsTo(models.User, { foreignKey: 'user_id'});
    Post.belongsTo(models.Group, { foreignKey: "group_id"});
    Post.belongsToMany(models.Image, { as: 'PostImages', through: 'PostImage' });
    Post.belongsToMany(models.Image, { as: 'PostHeaderImages', through: 'PostHeaderImage' });
    Post.belongsToMany(models.Image, { as: 'PostUserImages', through: 'PostUserImage' });
    Post.belongsToMany(models.Video, { as: 'PostVideos', through: 'PostVideo' });
    Post.belongsToMany(models.Audio, { as: 'PostAudios', through: 'PostAudio' });
  };

  Post.CONTENT_IDEA = 0;
  Post.CONTENT_STORY = 1;
  Post.CONTENT_NEWSFEED = 2;
  Post.CONTENT_PERSON = 3;
  Post.CONTENT_BLOG = 4;
  Post.CONTENT_QUESTION = 5;
  Post.CONTENT_SURVEY = 6;

  Post.getSearchVector = () => {
    return 'PostText';
  };

  Post.addFullTextIndex = () => {

    if(sequelize.options.dialect !== 'postgres') {
      console.log('Not creating search index, must be using POSTGRES to do this');
      return;
    }

    console.log("Adding full text index");

    const searchFields = ['name', 'description'];

    const vectorName = sequelize.models.Post.getSearchVector();
    sequelize.queryInterface.describeTable("posts").then( (data) => {
      if (!data.PostText) {
        sequelize
          .query('ALTER TABLE "' + sequelize.models.Post.tableName + '" ADD COLUMN "' + vectorName + '" TSVECTOR')
          .then(() => {
            return sequelize
              .query('UPDATE "' + sequelize.models.Post.tableName + '" SET "' + vectorName + '" = to_tsvector(\'english\', ' + searchFields.join(' || \' \' || ') + ')')
              .error(console.log);
          }).then(() => {
          return sequelize
            .query('CREATE INDEX post_search_idx ON "' + sequelize.models.Post.tableName + '" USING gin("' + vectorName + '");')
            .error(console.log);
        }).then(() => {
          return sequelize
            .query('CREATE TRIGGER post_vector_update BEFORE INSERT OR UPDATE ON "' + sequelize.models.Post.tableName + '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' + vectorName + '", \'pg_catalog.english\', ' + searchFields.join(', ') + ')')
            .error(console.log);
        }).error(console.log);
      } else {
        log.info("PostText search index is already setup");
      }
    });
  };

  Post.search = (query, groupId, modelCategory) => {
    console.log("In search for " + query);

    if(sequelize.options.dialect !== 'postgres') {
      console.log('Search is only implemented on POSTGRES database');
      return;
    }

    query = sequelize.getQueryInterface().escape(query);
    console.log(query);

    return sequelize.models.Post.findAll({
      order: [
        ["created_at","DESC"],
        [ { model: sequelize.models.Video, as: "PostVideos" }, 'updated_at', 'desc' ],
        [ { model: sequelize.models.Video, as: "PostVideos" }, { model: sequelize.models.Image, as: 'VideoImages' } ,'updated_at', 'asc' ]
      ],
      where: sequelize.literal('"PostText" @@ plainto_tsquery(\'english\', :query)'),
      replacements: {
        query: query
      },
      limit: 1024,
      attributes: ['id','name','description','public_data','status','content_type','official_status','counter_endorsements_up','cover_media_type',
        'counter_endorsements_down','group_id','language','counter_points','counter_flags','location','created_at','category_id'],
      include: [
        {
          model: sequelize.models.Category,
          attributes: { exclude: ['ip_address', 'user_agent'] },
          required: false,
          include: [
            {
              model: sequelize.models.Image,
              required: false,
              as: 'CategoryIconImages',
              attributes: ['id','formats'],
              order: [
                [ { model: sequelize.models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]
              ]
            }
          ]
        },
        {
          model: sequelize.models.PostRevision,
          required: false
        },
        {
          model: sequelize.models.Point,
          attributes: ['id','content'],
          required: false
        },
        { model: sequelize.models.Image,
          as: 'PostHeaderImages',
          attributes: ['id','formats','updated_at'],
          required: false
        },
        {
          model: sequelize.models.Video,
          attributes: ['id','formats','updated_at','viewable','public_meta'],
          as: 'PostVideos',
          required: false,
          include: [
            {
              model: sequelize.models.Image,
              as: 'VideoImages',
              attributes:["formats","updated_at"],
              required: false
            },
          ]
        },
        {
          model: sequelize.models.Group,
          required: true,
          attributes: ['id','configuration','name','theme_id','access'],
          where: {
            id: groupId
          }
        }
      ]
    });
  };

  Post.prototype.setupModerationData = function () {
    if (!this.data) {
      this.set('data', {});
    }
    if (!this.data.moderation) {
      this.set('data.moderation', {});
    }
  };

  Post.prototype.report = function (req, source, callback) {
    this.setupModerationData();
    async.series([
      (seriesCallback) => {
        if (!this.data.moderation.lastReportedBy) {
          this.set('data.moderation.lastReportedBy', []);
          if ((source==='user' || source==='fromUser') && !this.data.moderation.toxicityScore) {
            log.info("process-moderation post toxicity on manual report");
            queue.create('process-moderation', { type: 'estimate-post-toxicity', postId: this.id }).priority('high').removeOnComplete(true).save();
          }
        }
        this.set('data.moderation.lastReportedBy',
          [{ date: new Date(), source: source, userId: (req && req.user) ? req.user.id : null, userEmail: (req && req.user) ? req.user.email : 'anonymous' }].concat(this.data.moderation.lastReportedBy)
        );
        this.save().then(() => {
          seriesCallback();
        }).catch((error) => {
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        if (req && req.disableNotification===true) {
          seriesCallback();
        } else {
          sequelize.models.AcActivity.createActivity({
            type: 'activity.report.content',
            userId: (req && req.user) ? req.user.id : null,
            postId: this.id,
            groupId: this.group_id,
            communityId: (this.Group && this.Group.Community) ? this.Group.Community.id : null,
            domainId:  (this.Group && this.Group.Community && this.Group.Community.Domain) ? this.Group.Community.Domain.id : null
          }, (error) => {
            seriesCallback(error);
          });
        }
      }
    ], (error) => {
      this.increment('counter_flags');
      callback(error);
    });
  };

  Post.prototype.simple = function () {
    return { id: this.id, name: this.name };
  };

  Post.prototype.updateAllExternalCounters = function (req, direction, column, done) {
    async.parallel([
      (callback) => {
        sequelize.models.Group.findOne({
          where: {id: this.group_id}
        }).then((group) => {
          if (direction==='up')
            group.increment(column);
          else if (direction==='down') {
            const groupColumnValue = group[column];
            if (groupColumnValue && groupColumnValue>0) {
              group.decrement(column);
            }
          }
          group.updateAllExternalCounters(req, direction, column, callback);
        })
      }
    ], (err) => {
      done(err);
    });
  };

  Post.prototype.updateAllExternalCountersBy = function (req, direction, column, updateBy, done) {
    if (updateBy && updateBy>0) {
      async.parallel([
        (callback) => {
          sequelize.models.Group.findOne({
            where: {id: this.group_id}
          }).then((group) => {
            if (direction==='up')
              group.increment(column, {by: updateBy});
            else if (direction==='down') {
              const groupColumnValue = group[column];
              if (groupColumnValue && (groupColumnValue-updateBy)>=0) {
                group.decrement(column, {by: updateBy});
              } else if (groupColumnValue) {
                group.decrement(column, {by: groupColumnValue});
              }
            }
            group.updateAllExternalCounters(req, direction, column, callback);
          })
        }
      ], (err) => {
        done(err);
      });
    } else {
      done();
    }
  };

  Post.prototype.setupHeaderImage = function (body, done) {
    if (body.uploadedHeaderImageId) {
      sequelize.models.Image.findOne({
        where: {id: body.uploadedHeaderImageId}
      }).then((image) => {
        if (image)
          this.addPostHeaderImage(image);
        done();
      });
    } else done();
  };

  Post.prototype.getImageFormatUrl = function (formatId) {
    if (this.PostHeaderImages && this.PostHeaderImages.length>0) {
      const formats = JSON.parse(this.PostHeaderImages[this.PostHeaderImages.length-1].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  };

  Post.prototype.setupImages = function (body, done) {
    async.parallel([
      (callback) => {
        this.setupHeaderImage(body, (err) => {
          if (err) return callback(err);
          callback();
        });
      }
    ], (err) => {
      done(err);
    });
  };

  Post.prototype.setupAfterSave = function (req, res, done) {
    const post = this;
    const thisRevision = sequelize.models.PostRevision.build({
      name: post.name,
      description: post.description,
      group_id: post.group_id,
      user_id: req.user.id,
      this_id: post.id,
      status: post.status,
      user_agent: req.useragent.source,
      ip_address: req.clientIp
    });
    thisRevision.save().then(() => {
      if (req.body.pointFor && req.body.pointFor!=="") {
        const point = sequelize.models.Point.build({
          group_id: post.group_id,
          post_id: post.id,
          content: req.body.pointFor,
          value: 1,
          user_id: req.user.id,
          status: post.status,
          user_agent: req.useragent.source,
          ip_address: req.clientIp
        });
        point.save().then(() => {
          const pointRevision = sequelize.models.PointRevision.build({
            group_id: point.group_id,
            post_id: post.id,
            content: point.content,
            value: point.value,
            user_id: req.user.id,
            point_id: point.id,
            status: post.status,
            user_agent: req.useragent.source,
            ip_address: req.clientIp
          });
          pointRevision.save().then(() => {
            log.info("process-moderation point toxicity after post and point has been saved");
            queue.create('process-moderation', { type: 'estimate-point-toxicity', pointId: point.id }).priority('high').removeOnComplete(true).save();
            queue.create('process-similarities', { type: 'update-collection', pointId: point.id }).priority('low').removeOnComplete(true).save();

            post.updateAllExternalCounters(req, 'up', 'counter_points', () => {
              post.increment('counter_points');
              done();
            });
          });
        });
      } else {
        done();
      }
    });
  };

  return Post;
};
