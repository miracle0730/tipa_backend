const bcrypt = require('bcryptjs')
const { createPool, sql } = require('slonik')

// in an existing slonik project, this would usually be setup in another module
const slonik = createPool(process.env.DATABASE_URL);

(async function () {

    await seedAdminUser();
    await seedSalesUser();
    await seedCategories();

    console.info('DONE');
})();

async function seedAdminUser() {
    try {
        const admin = {
            id: 1,
            fullname: 'Admin',
            email: 'admin@test.com',
            password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
            role: 1
        };

        await slonik.query(sql`insert into "user" (id, fullname, email, password, role) values(${admin.id}, ${admin.fullname}, ${admin.email}, ${admin.password}, ${admin.role})`);
        console.info('admin user has been created');
    } catch (err) {
        console.warn('user with id=1 is already exist!');
    }
}

async function seedSalesUser() {
    try {
        const sales = {
            id: 2,
            fullname: 'Sales',
            email: 'sales@test.com',
            password: bcrypt.hashSync('sales', bcrypt.genSaltSync(10)),
            role: 2
        };

        await slonik.query(sql`insert into "user" (id, fullname, email, password, role) values(${sales.id}, ${sales.fullname}, ${sales.email}, ${sales.password}, ${sales.role})`);
        console.info('sales user has been created');
    } catch (err) {
        console.warn('user with id=2 is already exist!');
    }
}

async function seedCategories() {
    try {

        const applicationCategories = [
            {
                id: 55,
                parent_id: 1,
                level: 2,
                title: 'Packaging'
            }, {
                id: 56,
                parent_id: 1,
                level: 2,
                title: 'Reel'
            }, {
                id: 61,
                parent_id: 55,
                level: 3,
                title: 'Bag-Film'
            }, {
                id: 62,
                parent_id: 55,
                level: 3,
                title: 'Pouch-Laminate'
            }, {
                id: 63,
                parent_id: 55,
                level: 3,
                title: 'Hybrid Packaging'
            }, {
                id: 64,
                parent_id: 56,
                level: 3,
                title: 'Reel – Film'
            }, {
                id: 65,
                parent_id: 56,
                level: 3,
                title: 'Reel – Laminate'
            }
        ];

        const productCategories = [
            {
                id: 10,
                parent_id: 2,
                level: 2,
                title: 'TIPA Clear'
            }, {
                id: 11,
                parent_id: 2,
                level: 2,
                title: 'TIPA Met'
            }, {
                id: 12,
                parent_id: 2,
                level: 2,
                title: 'TIPA Color'
            }, {
                id: 13,
                parent_id: 2,
                level: 2,
                title: 'TIPA Kraft'
            }
        ];

        const segmentCategories = [
            {
                id: 33,
                parent_id: 3,
                level: 2,
                title: 'Food'
            }, {
                id: 34,
                parent_id: 3,
                level: 2,
                title: 'Fashion'
            }, {
                id: 35,
                parent_id: 3,
                level: 2,
                title: 'Mailing'
            }, {
                id: 36,
                parent_id: 3,
                level: 2,
                title: 'Other'
            }, {
                id: 41,
                parent_id: 33,
                level: 3,
                title: 'Baked Goods'
            }, {
                id: 42,
                parent_id: 33,
                level: 3,
                title: 'Chilled Products'
            }, {
                id: 43,
                parent_id: 33,
                level: 3,
                title: 'Coffee / Tea'
            }, {
                id: 44,
                parent_id: 33,
                level: 3,
                title: 'Dry Food'
            }, {
                id: 45,
                parent_id: 33,
                level: 3,
                title: 'Frozen Food'
            }, {
                id: 46,
                parent_id: 33,
                level: 3,
                title: 'Fresh Produce'
            }, {
                id: 47,
                parent_id: 33,
                level: 3,
                title: 'Other (Food)'
            }, {
                id: 48,
                parent_id: 34,
                level: 3,
                title: 'Fashion'
            }, {
                id: 49,
                parent_id: 35,
                level: 3,
                title: 'Mailing'
            }, {
                id: 50,
                parent_id: 36,
                level: 3,
                title: 'Cosmetics & Toiletries'
            }, {
                id: 51,
                parent_id: 36,
                level: 3,
                title: 'Toys & Appliance'
            },

        ];

        const packetGoods = [
            {
                id: 100,
                parent_id: 41,
                level: 4,
                title: 'Bread'
            }, {
                id: 101,
                parent_id: 41,
                level: 4,
                title: 'Cakes'
            }, {
                id: 102,
                parent_id: 41,
                level: 4,
                title: 'Cookies'
            }, {
                id: 103,
                parent_id: 41,
                level: 4,
                title: 'Fresh Bakery'
            }, {
                id: 104,
                parent_id: 42,
                level: 4,
                title: 'Cakes & Pastries'
            }, {
                id: 105,
                parent_id: 42,
                level: 4,
                title: 'Fresh pasta'
            }, {
                id: 106,
                parent_id: 42,
                level: 4,
                title: 'Hard Cheese'
            }, {
                id: 107,
                parent_id: 42,
                level: 4,
                title: 'Meat'
            }, {
                id: 108,
                parent_id: 43,
                level: 4,
                title: 'Coffee Beans'
            }, {
                id: 109,
                parent_id: 43,
                level: 4,
                title: 'Coffee Pods'
            }, {
                id: 110,
                parent_id: 43,
                level: 4,
                title: 'Ground Coffee'
            }, {
                id: 111,
                parent_id: 43,
                level: 4,
                title: 'Loose Tea'
            }, {
                id: 112,
                parent_id: 43,
                level: 4,
                title: 'Tea Bag'
            }, {
                id: 113,
                parent_id: 44,
                level: 4,
                title: 'Bars'
            }, {
                id: 114,
                parent_id: 44,
                level: 4,
                title: 'Cereals'
            }, {
                id: 115,
                parent_id: 44,
                level: 4,
                title: 'Confectionery'
            }, {
                id: 116,
                parent_id: 44,
                level: 4,
                title: 'Dry Fruit'
            }, {
                id: 117,
                parent_id: 44,
                level: 4,
                title: 'Granola'
            }, {
                id: 118,
                parent_id: 44,
                level: 4,
                title: 'Legume'
            }, {
                id: 119,
                parent_id: 44,
                level: 4,
                title: 'Nuts'
            }, {
                id: 120,
                parent_id: 44,
                level: 4,
                title: 'Pasta'
            }, {
                id: 121,
                parent_id: 44,
                level: 4,
                title: 'Pet Food'
            }, {
                id: 122,
                parent_id: 44,
                level: 4,
                title: 'Powder'
            }, {
                id: 123,
                parent_id: 44,
                level: 4,
                title: 'Snacks'
            }, {
                id: 124,
                parent_id: 44,
                level: 4,
                title: 'Spices'
            }, {
                id: 125,
                parent_id: 45,
                level: 4,
                title: 'Cooked food'
            }, {
                id: 126,
                parent_id: 45,
                level: 4,
                title: 'Frozen Fish'
            }, {
                id: 127,
                parent_id: 45,
                level: 4,
                title: 'Frozen Fruits'
            }, {
                id: 128,
                parent_id: 45,
                level: 4,
                title: 'Frozen Meat'
            }, {
                id: 129,
                parent_id: 45,
                level: 4,
                title: 'Frozen Vegetables'
            }, {
                id: 130,
                parent_id: 45,
                level: 4,
                title: 'Ice cream bar'
            }, {
                id: 131,
                parent_id: 46,
                level: 4,
                title: 'Flowerpot'
            }, {
                id: 132,
                parent_id: 46,
                level: 4,
                title: 'Flowerwrap'
            }, {
                id: 133,
                parent_id: 46,
                level: 4,
                title: 'Fresh cut fruits/ vegetables'
            }, {
                id: 134,
                parent_id: 46,
                level: 4,
                title: 'Fresh Herbs'
            }, {
                id: 135,
                parent_id: 46,
                level: 4,
                title: 'Fruits'
            }, {
                id: 136,
                parent_id: 46,
                level: 4,
                title: 'Vegtables'
            }, {
                id: 137,
                parent_id: 47,
                level: 4,
                title: 'Chocolate'
            }, {
                id: 138,
                parent_id: 47,
                level: 4,
                title: 'Supplements - Pills'
            }, {
                id: 139,
                parent_id: 47,
                level: 4,
                title: 'Supplements - Powder'
            }, {
                id: 140,
                parent_id: 48,
                level: 4,
                title: 'Accessories'
            }, {
                id: 141,
                parent_id: 48,
                level: 4,
                title: 'Apparel\Fabrics'
            }, {
                id: 142,
                parent_id: 48,
                level: 4,
                title: 'Home Accessories'
            }, {
                id: 143,
                parent_id: 48,
                level: 4,
                title: 'Jewlery'
            }, {
                id: 144,
                parent_id: 48,
                level: 4,
                title: 'Shoes'
            }, {
                id: 145,
                parent_id: 49,
                level: 4,
                title: 'E-commerce'
            }, {
                id: 146,
                parent_id: 49,
                level: 4,
                title: 'Magazines'
            }, {
                id: 147,
                parent_id: 49,
                level: 4,
                title: 'Mailers'
            }, {
                id: 148,
                parent_id: 50,
                level: 4,
                title: 'Brushes'
            }, {
                id: 149,
                parent_id: 50,
                level: 4,
                title: 'Creams & Lotions'
            }, {
                id: 150,
                parent_id: 50,
                level: 4,
                title: 'Liquid -Soap'
            }, {
                id: 151,
                parent_id: 50,
                level: 4,
                title: 'Soap Bar'
            }, {
                id: 152,
                parent_id: 50,
                level: 4,
                title: 'Toiletries'
            }, {
                id: 153,
                parent_id: 51,
                level: 4,
                title: 'Toys'
            }, {
                id: 154,
                parent_id: 51,
                level: 4,
                title: 'Appliance'
            }
        ];

        const categories = [
            {
                id: 1,
                parent_id: null,
                level: 1,
                title: 'Application'
            },
            ...applicationCategories,
            {
                id: 2,
                parent_id: null,
                level: 1,
                title: 'Product Family'
            },
            ...productCategories,
            {
                id: 3,
                parent_id: null,
                level: 1,
                title: 'Segments'
            },
            ...segmentCategories,
            ...packetGoods
        ];

        for await (let cat of categories) {
            await slonik.query(sql`insert into "category" (id, parent_id, level, title) values(${cat.id}, ${cat.parent_id}, ${cat.level}, ${cat.title})`);
        }

        console.info('categories has been created');
    } catch (err) {
        console.warn('create categories error!', err);
    }
}

module.exports = { slonik }