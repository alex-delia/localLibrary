const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    family_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    date_of_birth: {
        type: Date
    },
    date_of_death: {
        type: Date
    },
});

//virtual for author's full name
AuthorSchema.virtual('name').get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = '';

    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
});

//Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
    return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual('lifespan').get(function () {
    const date_of_birth_formatted = this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
    const date_of_death_formatted = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';

    return `${date_of_birth_formatted} - ${date_of_death_formatted}`;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
    return this.date_of_birth === undefined ? '' : DateTime.fromJSDate(this.date_of_birth).toISODate();
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function () {
    return this.date_of_death === undefined ? '' : DateTime.fromJSDate(this.date_of_death).toISODate();
});

//export module
module.exports = mongoose.model("Author", AuthorSchema);
