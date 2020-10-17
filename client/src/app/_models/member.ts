import { Photo } from "./photo";

export interface Member {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  alias: string;
  dateOfBirth: Date;
  age: number;
  contactNo: string;
  emailId: string;
  gender: string;
  biodata: string;
  lookingFor: string;
  interests: string;
  religion: string;
  cast: string;
  city: string;
  state: string;
  country: string;
  photos: Photo[];
  photoUrl: string;
  lastActive: Date;
  createdDate: Date;
}

