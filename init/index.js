const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: '../.env' });
}

function formatMongoUri(rawUri) {
    if (!rawUri || typeof rawUri !== "string") return rawUri;
    let uri = rawUri.trim().replace(/^["']|["']$/g, "");
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^/]+)(.*)$/i);
    if (!match) return uri;
    const [, scheme, userHost, rest] = match;
    const lastAt = userHost.lastIndexOf("@");
    if (lastAt === -1) return uri;
    const auth = userHost.slice(0, lastAt);
    const host = userHost.slice(lastAt + 1);
    const colonIdx = auth.indexOf(":");
    if (colonIdx === -1) return uri;
    let user = auth.slice(0, colonIdx);
    let pass = auth.slice(colonIdx + 1);
    if (user.startsWith("<") && user.endsWith(">")) user = user.slice(1, -1);
    if (pass.startsWith("<") && pass.endsWith(">")) pass = pass.slice(1, -1);
    const safeDecode = (s) => {
        try { return decodeURIComponent(s); } catch { return s; }
    };
    const safeUser = encodeURIComponent(safeDecode(user));
    const safePass = encodeURIComponent(safeDecode(pass));
    return `${scheme}${safeUser}:${safePass}@${host}${rest}`;
}

const rawDbUrl = process.env.ATLASDB_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wanderList';
const dbUrl = formatMongoUri(rawDbUrl);

const main = async () => {
    await mongoose.connect(dbUrl);
};

main()
.then(async () => {
    console.log('Database Connected');
    await initialize();
    mongoose.connection.close();
})
.catch((err) => {
    console.log(err);
});

let initialize = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((e) => ({
        ...e,
        owner: '6ad487b786cf14320b1a514d',
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
