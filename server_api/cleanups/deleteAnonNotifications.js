const models = require('../models');
const moment = require('moment');

const maxNumberOfNotificationsToDelete = 1000;

let numberOfDeletedNotifications = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

(async ()=>{
  let haveNotificationsToDelete = true;
  let userOffset = 0;
  while(haveNotificationsToDelete && numberOfDeletedNotifications<maxNumberOfNotificationsToDelete) {
    try {
      const users = await models.User.unscoped().findAll({
        where: {
          created_at: {
            [models.Sequelize.Op.lte]: moment().add(-3, 'days').toISOString()
          },
          profile_data: {
            isAnonymousUser: {
              [models.Sequelize.Op.is]: true
            }
          }
        },
        attributes:['id'],
        offset: userOffset,
        limit: 500
      });

      if (users.length>0) {
        console.log(`Found ${users.length} users`);
        userOffset+=500;
        const userIds = users.map(n=>{ return n.id});

        const notifications = await models.AcNotification.unscoped().findAll({
          where: {
            user_id: {
              [models.Sequelize.Op.in]: userIds
            }
          },
          attributes:['id'],
        });

        if (notifications.length>0) {
          console.log(`Found ${notifications.length} notifications`);
          const notificationIds = notifications.map(n=>{ return n.id});

          const chunkedIds = chunk(notificationIds, 100);

          for (let i=0; i<chunkedIds.length;i++) {
            const destroyInfo =  await models.AcNotification.unscoped().destroy({
              where: {
                id: {
                  [models.Sequelize.Op.in]: chunkedIds[i]
                }
              }
            });

            numberOfDeletedNotifications+=destroyInfo;

            console.log(`Destroyed ${destroyInfo} old notifications from chunk ${i} - total ${numberOfDeletedNotifications}`);

            await sleep(50);

            if (numberOfDeletedNotifications>=maxNumberOfNotificationsToDelete) {
              break;
            }
          }
        }

        await sleep(50);
      } else {
        haveNotificationsToDelete = false;
      }
    } catch(error) {
      console.error(error);
      haveNotificationsToDelete = false;
    }
  }
  console.log("All old anon notifications deleted");
  process.exit();
})();

/*(async ()=>{
  let haveNotificationsToDelete = true;
  while(haveNotificationsToDelete) {
    try {
      const notifications = await models.AcNotification.unscoped().findAll({
        include: [
          {
            model: models.User,
            where: {
              created_at: {
                [models.Sequelize.Op.lte]: moment().add(-3, 'days').toISOString()
              },
              private_profile_data: {
                isAnonymousUser: true
              }
            },
            attributes:['id','user_id','private_profile_data'],
            required: true
          }
        ],
        attributes: ['id','user_id'],
        limit: 1000
      });

      if (notifications.length>0) {
        const notificationIds = notifications.map(n=>n.id);

        const destroyInfo =  await models.AcNotification.unscoped().destroy({
          where: {
            id: {
              [models.Sequelize.Op.in]: notificationIds
            }
          }
        });

        const b = destroyInfo;
      } else {
        haveNotificationsToDelete = false;
      }
    } catch(error) {
      console.error(error);
      haveNotificationsToDelete = false;
    }
  }
  console.log("All old anon notifications deleted");
  process.exit();
})();*/