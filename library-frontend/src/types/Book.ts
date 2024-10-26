import { Review } from "./Review";

export interface Book {
    id: number;
    title: string;
    author: string;
    coverImage: string;        // This will map to CoverImage in the backend
    description?: string;    // Optional field for description
    publisher: string;       // Required field for publisher
    publicationDate: Date;   // Required field for publication date
    category: string;        // Required field for category
    isbn: string;            // Required field for ISBN
    pageCount: number;       // Number of pages
    isAvailable: boolean;    // Availability status
    checkedOutDate?: Date;   // Optional field for checkout date
    returnDate?: Date;       // Optional field for return date
    averageRating?: number;
    reviews: Review[]; 
}