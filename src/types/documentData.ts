import { DocumentData, FieldValue } from "firebase/firestore";

export interface UserDocumentData extends DocumentData {
  name: string;
  email: string;
  username: string;
  userImg: string;
  uid: string;
  timeStamp: FieldValue;
}

export interface PostDocumentData extends DocumentData {
  id: string;
  text: string;
  username: string;
  userImg: string;
  name: string;
  timeStamp: FieldValue;
  image?: string;
}

export interface LikeDocumentData extends DocumentData {
  username: string;
}

export interface CommentDocumentData extends DocumentData {
  comment: string;
  name: string;
  username: string;
  userImg: string;
  timeStamp: FieldValue;
  userId: string;
}
