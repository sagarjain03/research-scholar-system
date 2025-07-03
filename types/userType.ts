export interface UserType {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: "scholar" | "admin";
}