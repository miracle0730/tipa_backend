const bcrypt = require('bcryptjs')
const { createPool, sql } = require('slonik')

// in an existing slonik project, this would usually be setup in another module
const slonik = createPool(process.env.DATABASE_URL);

(async function () {

    await seedUpdateCategoryTitle();

    console.info('DONE');
})();

async function seedUpdateCategoryTitle() {
    try {

        await slonik.query(sql`update category set title = 'Product Family' where category.id = 2`);

        console.info('Category has been updated');
    } catch (err) {
        console.warn('Category has not updated!');
    }

}

module.exports = { slonik }