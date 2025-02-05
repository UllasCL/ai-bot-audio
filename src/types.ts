export interface ChatResponse {
    result: string;
    session_id: string;
    response_type: string;
    product: string;
}

export interface ChatRequest {
    query: string;
    request_type: string;
    session_id?: string;
    product?: string;
}
