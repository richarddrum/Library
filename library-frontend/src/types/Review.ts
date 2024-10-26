export interface Review {
    message: string;
    rating: number | null; // assuming rating can be null if not provided
}