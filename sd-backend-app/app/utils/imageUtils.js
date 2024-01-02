const getPrompt = (artDirection, subject, artist) => {
    return `${artDirection}-style painting of ${subject}${artist ? `, by ${artist}` : ''}, beautiful oil painting`;
};

const negativePrompts = {
    abstractionism:     "realistic, photographic, figurative, concrete",
    classicism:         "anime, deformed, modern",
    cubism:             "anime, photorealistic, deformed, glitch, low contrast, noisy",
    expressionism:      "realism, symmetry, quiet, calm, photo, deformed",
    impressionism:      "anime, photorealistic, deformed, glitch, noisy, watermark, label, text",
    minimalism:         "realistic, photorealistic, photorealistic, low contrast",
    popart:             "ugly, deformed, noisy, blurry, low contrast, realism, photorealistic, minimalist",
    realism:            "anime, ugly, modern, deformed",
    renaissance:        "ugly, deformed, noisy, blurry, low contrast, modernist, minimalist, abstract",
    surrealism:         "anime, photorealistic, realistic, deformed, glitch, noisy, low contrast"
};

module.exports = {
    getPrompt,
    negativePrompts
};