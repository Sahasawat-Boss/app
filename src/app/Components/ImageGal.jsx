"use client";

import { useState, useEffect } from "react";
import FilterCategory from "./FilterCategory";

// List of possible tags
const tagPool = ["AI", "Tech", "Innovation", "Developer", "Explore", "Coding", "Test", "Gallery", "Stack", "Diversition"];

// Function to generate random tags (1-4 tags per image)
const getRandomTags = () => {
    const shuffled = tagPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 1);
};

// Function to generate random image sizes
const getRandomSize = () => {
    const width = Math.floor(Math.random() * 130) + 150;  // Width between 150-280px
    const height = Math.floor(Math.random() * 140) + 160; // Height between 160-300px
    return `${width}x${height}`;
};

const ImageGal = () => {
    const [images, setImages] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);

    // Load initial images
    useEffect(() => {
        loadMoreImages(12); // Default to 12 images initially
    }, []);

    // Load More Images (for Infinite Scroll)
    const loadMoreImages = (count = 6) => {
        const newImages = Array.from({ length: count }, () => ({
            id: crypto.randomUUID(), // Generate a unique ID for each image << avoid Errors
            url: `https://placehold.co/${getRandomSize()}`, // Random image size
            tags: getRandomTags(),
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    // Detect Scroll Position for Infinite Scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
            ) {
                loadMoreImages(); // Load more images when reaching the bottom
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const addTag = (id) => {
        const tag = prompt("Create new tag:");
        if (tag) {
            setImages((prev) =>
                prev.map((img) =>
                    img.id === id
                        ? { ...img, tags: [...new Set([...img.tags, tag])] } // Avoid duplicate tags
                        : img
                )
            );
        }
    };

    // Filter images by selected tag
    const filteredImages = selectedTag
        ? images.filter((img) => img.tags.includes(selectedTag))
        : images;

    // Scrolls to top when click tag
    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    return (
        <div className="p-6 animate-fade-in-up lg:max-w-7xl mx-auto">
            
            {/* ✅ Filter Category Display Component */}
            <FilterCategory selectedTag={selectedTag} clearFilter={() => setSelectedTag(null)} />

            {/* Masonry Grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 pt-4">
                {filteredImages.map((img) => (
                    <div
                        key={img.id} // ✅ Unique image key
                        className="break-inside-avoid mb-4 rounded p-2 shadow-xl shadow-black/15 bg-white hover:scale-105 transition duration-200 animate-fade-in-up"
                    >
                        <img src={img.url} alt="Gallery" className="w-full h-full rounded" />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {img.tags.map((tag) => (
                                <button
                                    key={`${tag}-${img.id}`} // ✅ Unique tag key
                                    onClick={() => handleTagClick(tag)} // ✅ Calls function to set tag & scroll to top
                                    className={`px-2 py-0.5 text-sm lg:text-base border border-blue-400 rounded-full hover:cursor-pointer 
                                    ${selectedTag === tag ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500 hover:bg-blue-400 hover:text-white"}`}
                                >
                                    {tag}
                                </button>
                            ))}
                            <button
                                onClick={() => addTag(img.id)}
                                className="px-2 py-1 text-xs bg-white border border-blue-400 text-blue-500 rounded hover:bg-blue-400 hover:text-white hover:cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGal;
