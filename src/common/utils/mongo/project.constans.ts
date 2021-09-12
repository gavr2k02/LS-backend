export const GROUP_FULL_DATA_PROJECT = {
  _id: 1,
  color: 1,
  facultyId: 1,
  name: 1,
  studentIds: 1,
  faculty: { id: 1, color: 1, groupIds: 1, name: 1 },
};

export const STUDENT_FULL_DATA_PROJECT = {
  _id: 1,
  color: 1,
  facultyId: 1,
  name: 1,
  studentIds: 1,
  firstName: 1,
  lastName: 1,
  groupId: 1,
  group: { id: 1, color: 1, studentIds: 1, name: 1, facultyId: 1, faculty: { id: 1, color: 1, groupIds: 1, name: 1 } },
};
