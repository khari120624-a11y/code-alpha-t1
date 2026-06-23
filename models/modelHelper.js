const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const store = {
  User: [],
  Product: [],
  Order: [],
};

// Initialize seed data
const initSeedData = () => {
  if (store.User.length > 0) return;

  const adminId = 'admin_user_id_12345';
  const userId = 'john_doe_id_54321';

  store.User.push({
    _id: adminId,
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  store.User.push({
    _id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('user123', 10),
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const sampleProducts = [
    {
      _id: 'prod_1',
      user: adminId,
      name: 'Sony WH-1000XM4 Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      description: 'Industry-leading noise-canceling wireless over-ear headphones with Alexa voice control and 30 hours of battery life.',
      category: 'Audio',
      price: 349.99,
      countInStock: 12,
      rating: 4.8,
      numReviews: 24,
    },
    {
      _id: 'prod_2',
      user: adminId,
      name: 'Keychron K2 Mechanical Keyboard',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
      description: 'A 75% layout wireless mechanical keyboard with Gateron switches, RGB backlighting, and dual compatibility for Mac and Windows.',
      category: 'Keyboards',
      price: 99.99,
      countInStock: 8,
      rating: 4.5,
      numReviews: 18,
    },
    {
      _id: 'prod_3',
      user: adminId,
      name: 'Apple Watch Series 8 GPS',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      description: 'Advanced health monitoring sensors, crash detection, workout tracking, and a bright always-on Retina display.',
      category: 'Wearables',
      price: 399.99,
      countInStock: 5,
      rating: 4.7,
      numReviews: 14,
    },
    {
      _id: 'prod_4',
      user: adminId,
      name: 'MX Master 3S Ergonomic Mouse',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
      description: 'Ultra-fast MagSpeed scrolling ergonomic mouse with an 8K DPI sensor that tracks on glass, and quiet click design.',
      category: 'Accessories',
      price: 99.99,
      countInStock: 20,
      rating: 4.6,
      numReviews: 32,
    },
    {
      _id: 'prod_5',
      user: adminId,
      name: 'Bose SoundLink Flex Bluetooth Speaker',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
      description: 'Waterproof portable speaker designed to deliver deep, immersive audio with custom-engineered transducers and PositionIQ tech.',
      category: 'Audio',
      price: 149.99,
      countInStock: 0,
      rating: 4.4,
      numReviews: 9,
    },
    {
      _id: 'prod_6',
      user: adminId,
      name: 'Logitech G PRO X Superlight Gaming Mouse',
      image: 'https://images.unsplash.com/photo-1625600243103-1dc6824c6c8a?w=600&q=80',
      description: "Designed with the world's leading esports pros, weighing less than 63 grams with ultra-low latency LIGHTSPEED wireless connectivity.",
      category: 'Accessories',
      price: 159.99,
      countInStock: 15,
      rating: 4.9,
      numReviews: 40,
    },
  ];

  store.Product.push(...sampleProducts);
};

initSeedData();

class MockDocument {
  constructor(modelName, data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }
    this._modelName = modelName;
  }

  async save() {
    if (this._modelName === 'User') {
      if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
        this.password = bcrypt.hashSync(this.password, 10);
      }
    }
    const list = store[this._modelName];
    const idx = list.findIndex(item => item._id.toString() === this._id.toString());
    if (idx >= 0) {
      list[idx] = { ...this };
    } else {
      list.push({ ...this });
    }
    return this;
  }

  async matchPassword(enteredPassword) {
    if (this._modelName === 'User') {
      return bcrypt.compareSync(enteredPassword, this.password);
    }
    return false;
  }
}

function matches(doc, query) {
  for (const key in query) {
    const val = query[key];
    if (val === undefined) continue;
    if (val && typeof val === 'object' && '$regex' in val) {
      const regex = new RegExp(val.$regex, val.$options || '');
      if (!regex.test(doc[key] || '')) return false;
    } else {
      const docVal = doc[key];
      if (docVal === undefined) return false;
      if (docVal === null && val === null) continue;
      if (docVal.toString() !== val.toString()) return false;
    }
  }
  return true;
}

class MockQuery {
  constructor(modelName, promise) {
    this._modelName = modelName;
    this._promise = promise;
  }

  sort(options) {
    this._promise = this._promise.then(docs => {
      if (!Array.isArray(docs)) return docs;
      if (typeof options === 'string') {
        const field = options.startsWith('-') ? options.substring(1) : options;
        const dir = options.startsWith('-') ? -1 : 1;
        return [...docs].sort((a, b) => {
          if (a[field] < b[field]) return -1 * dir;
          if (a[field] > b[field]) return 1 * dir;
          return 0;
        });
      } else if (typeof options === 'object') {
        const field = Object.keys(options)[0];
        const dir = options[field];
        return [...docs].sort((a, b) => {
          if (a[field] < b[field]) return -1 * dir;
          if (a[field] > b[field]) return 1 * dir;
          return 0;
        });
      }
      return docs;
    });
    return this;
  }

  select(fields) {
    return this;
  }

  populate(field, selectFields) {
    this._promise = this._promise.then(docs => {
      if (!docs) return docs;
      const isArray = Array.isArray(docs);
      const items = isArray ? docs : [docs];

      for (const item of items) {
        if (field === 'user' && item.user) {
          const userIdStr = typeof item.user === 'object' && item.user._id ? item.user._id.toString() : item.user.toString();
          const userDoc = store.User.find(u => u._id.toString() === userIdStr);
          if (userDoc) {
            item.user = {
              _id: userDoc._id,
              id: userDoc._id,
              name: userDoc.name,
              email: userDoc.email,
              isAdmin: userDoc.isAdmin,
            };
          }
        }
      }

      return docs;
    });
    return this;
  }

  then(onfulfilled, onrejected) {
    return this._promise.then(onfulfilled, onrejected);
  }

  catch(onrejected) {
    return this._promise.catch(onrejected);
  }
}

class MockModelClass {
  constructor(modelName) {
    this._modelName = modelName;
  }

  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      const docs = store[this._modelName].filter(doc => matches(doc, query));
      return docs.map(doc => new MockDocument(this._modelName, doc));
    });
    return new MockQuery(this._modelName, promise);
  }

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      const doc = store[this._modelName].find(doc => matches(doc, query));
      return doc ? new MockDocument(this._modelName, doc) : null;
    });
    return new MockQuery(this._modelName, promise);
  }

  findById(id) {
    const promise = Promise.resolve().then(() => {
      const doc = store[this._modelName].find(doc => doc._id.toString() === id.toString());
      return doc ? new MockDocument(this._modelName, doc) : null;
    });
    return new MockQuery(this._modelName, promise);
  }

  async create(data) {
    if (Array.isArray(data)) {
      const docs = data.map(item => new MockDocument(this._modelName, item));
      for (const doc of docs) {
        await doc.save();
      }
      return docs;
    } else {
      const doc = new MockDocument(this._modelName, data);
      await doc.save();
      return doc;
    }
  }

  async insertMany(data) {
    return this.create(data);
  }

  async deleteOne(query = {}) {
    const idx = store[this._modelName].findIndex(doc => matches(doc, query));
    if (idx >= 0) {
      store[this._modelName].splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(query = {}) {
    const initialCount = store[this._modelName].length;
    store[this._modelName] = store[this._modelName].filter(doc => !matches(doc, query));
    const deletedCount = initialCount - store[this._modelName].length;
    return { deletedCount };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = store[this._modelName].findIndex(doc => doc._id.toString() === id.toString());
    if (idx < 0) return null;
    const doc = store[this._modelName][idx];
    const fields = update.$set || update;
    Object.assign(doc, fields);
    return new MockDocument(this._modelName, doc);
  }
}

function getModel(modelName, schema) {
  const realModel = mongoose.model(modelName, schema);
  const mockModelInstance = new MockModelClass(modelName);

  const DynamicModel = class {
    constructor(data) {
      if (mongoose.connection.readyState === 1) {
        return new realModel(data);
      } else {
        return new MockDocument(modelName, data);
      }
    }

    static find(query) {
      if (mongoose.connection.readyState === 1) {
        return realModel.find(query);
      } else {
        return mockModelInstance.find(query);
      }
    }

    static findOne(query) {
      if (mongoose.connection.readyState === 1) {
        return realModel.findOne(query);
      } else {
        return mockModelInstance.findOne(query);
      }
    }

    static findById(id) {
      if (mongoose.connection.readyState === 1) {
        return realModel.findById(id);
      } else {
        return mockModelInstance.findById(id);
      }
    }

    static create(data) {
      if (mongoose.connection.readyState === 1) {
        return realModel.create(data);
      } else {
        return mockModelInstance.create(data);
      }
    }

    static insertMany(data) {
      if (mongoose.connection.readyState === 1) {
        return realModel.insertMany(data);
      } else {
        return mockModelInstance.insertMany(data);
      }
    }

    static deleteOne(query) {
      if (mongoose.connection.readyState === 1) {
        return realModel.deleteOne(query);
      } else {
        return mockModelInstance.deleteOne(query);
      }
    }

    static deleteMany(query) {
      if (mongoose.connection.readyState === 1) {
        return realModel.deleteMany(query);
      } else {
        return mockModelInstance.deleteMany(query);
      }
    }

    static findByIdAndUpdate(id, update, options) {
      if (mongoose.connection.readyState === 1) {
        return realModel.findByIdAndUpdate(id, update, options);
      } else {
        return mockModelInstance.findByIdAndUpdate(id, update, options);
      }
    }
  };

  return DynamicModel;
}

module.exports = {
  getModel,
  store,
};
