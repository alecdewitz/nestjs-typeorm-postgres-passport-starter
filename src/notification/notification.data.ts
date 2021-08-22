const people = [
  {
    name: 'Lindsay Walton',
    username: 'lindsay_walton',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
  },

  {
    name: 'John Puck',
    username: 'pucker1',
    imageUrl:
      'https://images.unsplash.com/photo-1619359059287-9d024d7081ef?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=256&fit=max',
  },
  {
    name: 'Jerry Seinfeld',
    username: 'jsein',
    imageUrl:
      'https://images.unsplash.com/photo-1619575356150-8de618a7d9aa?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=256&fit=max',
  },
];
export const activityItems = [
  {
    id: 1,
    person: people[0],
    type: 'CONNECTION',
    read: false,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[2],
    type: 'CONNECTION',
    read: false,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[0],
    type: 'VIEW',
    read: true,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[3],
    type: 'VIEW',
    read: true,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[1],
    type: 'VIEW',
    read: true,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[0],
    type: 'REQUEST',
    read: true,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[0],
    type: 'VIEW',
    read: true,
    timestamp: '1h',
  },
  {
    id: 1,
    person: people[1],
    type: 'VIEW',
    read: true,
    timestamp: '1h',
  },
];
