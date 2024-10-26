export interface Review {
    review: string;
    rating: number | null; // assuming rating can be null if not provided
}