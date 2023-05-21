export type Room = {
  id: string;
  playerOne: Player;
  playerTwo: Player;
};

type Player = {
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
