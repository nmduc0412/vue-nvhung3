export interface ServiceResponse<T>{

    // Mã Code
    code: number;

    // Dữ liệu trả về
    data : T;

    // Nội dung thông điệp
    message : string;
}