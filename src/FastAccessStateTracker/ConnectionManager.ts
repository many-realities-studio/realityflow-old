import { FlowUser } from "./FlowLibrary/FlowUser";

/**
 * Handles the connections of all active users
 */
export class ConnectionManager
{
  //potentially upgrade to map for larger user base
  private static _LoggedInUsers: Array<FlowUser> = [];

  /**
   * Sends a message to a set of users
   * @param message The Message to be send
   * @param usersToSendTo The users that should receive the message
   */
  public static SendMessage(message : string, usersToSendTo: FlowUser[]) : void
  {
    usersToSendTo.forEach(user => {
      user.connectionList.forEach(connection => connection.send(message));
    });
  }

  /**
   * Sends a message to all logged in users
   * @param message 
   */
  public static NotifyAllUsers(message : string) : void
  {
    this._LoggedInUsers.forEach(user => {
      user.connectionList.forEach(connection => connection.send(message));
    });
  }

  /**
   * Logs in a user. This is used to keep track of users that are actively
   * using the server
   * @param userToLogin 
   * @param connectionToUser 
   */
  public static LoginUser(userToLogin : FlowUser, connectionToUser : WebSocket) : void
  {
    userToLogin.Login(connectionToUser);
    if(!this.GetSavedUser(userToLogin))
    {
      this._LoggedInUsers.push(userToLogin);
    }
  }

  /**
   * Logs out a user. This is used to keep track of users that are actively
   * using the server
   * @param userToLogout 
   */
  public static LogoutUser(userToLogout : FlowUser) : void
  {
    // Find user in the list of known users
    let index = this._LoggedInUsers.findIndex((element) => element.id == userToLogout.id);

    let foundUser : FlowUser = null;
    if(index > -1)
    {
      foundUser = this._LoggedInUsers.splice(index, 1)[0];
      foundUser.Logout();
    }
    else
    {
      // TODO: Implement what happens when user is not found
    }
  }

  /**
   * Finds the user that holds the relevant websocket connection and returns said FlowUser,
   * or undefined if no user is found.
   * @param connectionToFind The connection which is associated with a user
   */
  public static FindUserWithConnection(connectionToFind: WebSocket) : FlowUser
  {
    return this._LoggedInUsers.find(user => user.connectionList.find(connection => connection == connectionToFind));
  }

  public static GetSavedUser(user: FlowUser) : FlowUser
  {
    let val = this._LoggedInUsers.find((temp) => temp.id == user.id);

    return val;

  }

}