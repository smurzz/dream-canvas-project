export function categoryValidator(category) {
    if (!category) return "Please specify a category.";
    return '';
};

export function typeValidator(type) {
    if (!type) return "Please choose a type of the object.";
    return '';
};

export function selectedImagesValidator(selectedImages) {
    if (!selectedImages || selectedImages.length < 5) return "Please choose at least 5 images!";
    return '';
};