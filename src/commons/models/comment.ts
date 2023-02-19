// Thông tin comment
export class Comment {
    id: string;
    name: string;
    content: string;
    status: number;
    creationTime: Date;
    constructor(
      id: string = "",
      name: string = "",
      content: string = "",
      status: number = 0,
      creationTime: Date = new Date(),
    ) {
      this.id = id;
      this.name = name;
      this.content = content;
      this.status = status;
      this.creationTime = creationTime;
    }
  }