import slugify from 'slugify';



const toSlug = (categoryName: string) => {
    const slug = slugify(categoryName, { lower: true, strict: true});

    return slug;
}


export default toSlug;