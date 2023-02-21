const bcrypt = require('bcryptjs')
const { createPool, sql } = require('slonik')

// in an existing slonik project, this would usually be setup in another module
const slonik = createPool(process.env.DATABASE_URL);

(async function () {

    await seedCategories();

    console.info('DONE');
})();


async function seedCategories() {
    try {

        const categoriesLvl1 = [
            {
                parent_id: null,
                level: 1,
                title: 'Application type'
            },
            {
                parent_id: null,
                level: 1,
                title: 'Additional features'
            },

        ];

        for await (let cat of categoriesLvl1) {
            await slonik.query(sql`insert into "category" (parent_id, level, title) values(${cat.parent_id}, ${cat.level}, ${cat.title})`);
        }

        const resultApplications = await slonik.query(sql`SELECT title FROM "application"`);
        const resultCategories = await slonik.query(sql`SELECT * FROM "category"`);

        const [...applications] = resultApplications.rows;
        const [...categories] = resultCategories.rows;

        const uniqApplications = [];

        const isUniq = (application_title) => !uniqApplications.some(application => application.title === application_title);

        const validateApplication = (application) => {
            if (isUniq(application.title)) {
                uniqApplications.push(application);
            }
        };

        applications.forEach(application => validateApplication(application));

        const applicationTypeCategory = categories.find(category => category.title === 'Application type');

        for await (let applicationCategory of uniqApplications) {
            await slonik.query(sql`insert into "category" (parent_id, level, title) values(${applicationTypeCategory.id}, ${applicationTypeCategory.level + 1}, ${applicationCategory.title})`);
        }

        console.info('categories has been created');

        const resultNewCategories = await slonik.query(sql`SELECT * FROM "category" WHERE parent_id = ${applicationTypeCategory.id}`);

        const [...newCategories] = resultNewCategories.rows;

        for await (let application of applications) {
            const foundedApplicationCategory = newCategories.find(category => category.title === application.title);

            await slonik.query(sql`update "application" set "type" = ${foundedApplicationCategory.id} WHERE title = ${application.title}`);

        }

        console.info('applications has been updated');
    } catch (err) {
        console.warn('create categories error!', err);
    }
}

module.exports = { slonik }