export type Room = {
  id: string;
  playerOne: Player;
  playerTwo: Player;
};

export type Player = {
  id: string;
  ready: boolean;
};

const activeRooms: Room[] = [];

export const createRoom = (roomId: string, userId: string) => {
  activeRooms.push({
    id: roomId,
    playerOne: { id: userId, ready: false },
    playerTwo: { id: "", ready: false },
  });
};

export const joinRoom = (roomId: string, userId: string): boolean => {
  const room = activeRooms.find((r) => r.id === roomId);
  if (room) {
    room.playerTwo.id = userId;
    return true;
  }

  return false;
};
