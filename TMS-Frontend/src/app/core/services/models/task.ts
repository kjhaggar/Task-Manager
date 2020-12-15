export interface Task {
  _id: string;
  title: string;
  _listId: string;
  assignedTo: [
    {
      _id?: string;
      name: string;
      _userId: string;
      email: string;
    }
  ];
  status: string;
}
