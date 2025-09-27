import { StringDecoder } from 'string_decoder';

export class CreateFolderDto {
  name: string;
  userId: string; // vlasnik
  icon?: string;
}

export class UpdateFolderDto {
  name?: string;
  icon?: string;
}
