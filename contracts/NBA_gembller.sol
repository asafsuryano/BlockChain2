// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 < 0.8.0;
pragma experimental ABIEncoderV2;

contract NBA_gembller{
    struct User{
        string firtsName;
        string username;
        string password;
        address userAddress;
    }
    
 struct BPlayer{
      string name;
      uint rebounds;
      uint asists;
      uint points;
      uint blocks;
      uint steals;

    }
    
    
  struct  UserGamble{
        User user;
        BPlayer []  players;
        uint gambleAmount; 
        uint initialPrice;
        bool valid;
    }
    
   
    struct GamblingBattle{
        UserGamble userGamble1;
        UserGamble userGamble2;
        uint scoreUserGamble1;
        uint scoreUserGamble2;
    }
      
      bool isSecondGambller;
      uint GamblingBattleNum;
      User [] public userWhoWantToGambller;
      uint  numberOfPlayers=2;
      mapping(string => UserGamble)  userGambles;
       mapping(string => BPlayer)  players;
      mapping(string => User) usersMapping;
      mapping(address => User) usersAddress;

      mapping(uint => GamblingBattle) gamblingBattles;
      mapping(string => bool) userExists;
      mapping(address => bool) userExistsWithAddress;
      mapping(string=>uint[]) userNameToBattle;
      UserGamble userWaits_0;
      UserGamble userWaits_500;
      UserGamble userWaits_1000;
    


      constructor() public {
        GamblingBattleNum=1;
        isSecondGambller=false;
        userWaits_0.initialPrice=0;
        userWaits_500.initialPrice=500;
        userWaits_1000.initialPrice=1000;
      } 
       function register(string memory _firtsName,string  memory _username,string  memory _password) public  {
        User memory _user=User(_firtsName,_username,_password,msg.sender);
        require(!userExists[_user.username],"user allready exsist");
        usersMapping[_username]=_user;
        usersAddress[msg.sender]=_user;
        userExists[_user.username] = true; 
        userExistsWithAddress[msg.sender]=true; 
        }

      //return true if the user exsist and the password is correct 
      function login(string memory _username,string memory _password) public view returns (bool)  {
         User memory _user=usersMapping[_username];
         require(keccak256(abi.encodePacked((_user.password))) == keccak256(abi.encodePacked((_password))),"password is not correct ");
         return userExists[_username];
         
        }

        function loginWithAddress(address _userAddress) public view returns (bool)  {
         User memory _user=usersAddress[_userAddress];
         return userExistsWithAddress[_userAddress];
         
        }
          
    function createPlayer( string memory _playerName,
    uint _rebounds,uint _asists,uint _points ,uint _blocks,uint _steals) public {
      BPlayer memory _player=BPlayer(_playerName,_rebounds,_asists,_points,_blocks,_steals);
      players[_playerName]=_player;
    }


    function addPlayerToUser(string memory _username,string memory  _playerName) public 
      {
      // require(userGambles[_username].players.length < 5,"only 5 players is possible ");
       BPlayer memory _player=players[_playerName];
      userGambles[_username].players.push(_player);

      }
    event AddUserGambling(bool readyForBattle);
    function addUserGambling(string memory _username,uint _initialPrice) public   {   
          userGambles[_username].initialPrice=_initialPrice;
          User memory _user=usersMapping[_username];
          userGambles[_username].user=_user;
          userGambles[_username].gambleAmount=calculateGamblePriceWinner(_initialPrice, _username);       

          if(userGambles[_username].initialPrice==userWaits_0.initialPrice){
               if (isSecondGambller==false){
                userWaits_0=userGambles[_user.username];
                isSecondGambller=true;
                emit AddUserGambling(false);
               }    
          }else if(userGambles[_username].initialPrice==userWaits_500.initialPrice){
            if (isSecondGambller==false){
               userWaits_500=userGambles[_user.username];
               isSecondGambller=true;
                emit AddUserGambling(false);
            }
          }else{
            if (isSecondGambller==false){
               userWaits_1000=userGambles[_user.username];
               isSecondGambller=true;
              emit AddUserGambling(false);
             }
          }
          
         if(isSecondGambller)
          emit AddUserGambling(true);
     }
    

      function createBattle(string memory _username)public  {    
        gamblingBattles[GamblingBattleNum].userGamble1= userGambles[_username];  //get the userGamble1
      
        if ( gamblingBattles[GamblingBattleNum].userGamble1.initialPrice==0){
        gamblingBattles[GamblingBattleNum].userGamble2= userWaits_0;//get the usergamble2
        isSecondGambller=false;
        userNameToBattle[_username].push(GamblingBattleNum);
        userNameToBattle[userWaits_0.user.username].push(GamblingBattleNum);
        GamblingBattleNum+=1;
        
        }else if(gamblingBattles[GamblingBattleNum].userGamble1.initialPrice==500){
        gamblingBattles[GamblingBattleNum].userGamble2= userWaits_500;//get the usergamble2   
        isSecondGambller=false;
        userNameToBattle[_username].push(GamblingBattleNum);
        userNameToBattle[userWaits_500.user.username].push(GamblingBattleNum);
        GamblingBattleNum+=1;


        }else{
          gamblingBattles[GamblingBattleNum].userGamble2= userWaits_1000;//get the usergamble2
          isSecondGambller=false;
          userNameToBattle[_username].push(GamblingBattleNum);
          userNameToBattle[userWaits_1000.user.username].push(GamblingBattleNum);
          GamblingBattleNum+=1;
        }
        
      }

      
    function calculateGamblePriceWinner(uint _price,string memory _username)public view returns(uint){
      UserGamble storage _userGamble=userGambles[_username];
       uint sum=0;
      //check if there is length function of the array
     
      for (uint i=0;i<numberOfPlayers;i++){
       sum+=calculataPlayerSum(_userGamble.players[i]);
      }      
      return sum+_price; 
    }
    

    function calculataPlayerSum(BPlayer memory player) public view returns(uint)
    {
    
       uint priceOfPlayer=player.rebounds*10+player.points*5+player.steals*15+player.blocks*15
       +player.asists*10;
       return priceOfPlayer;
    }
          
      
      function calculateDayStatisticsOfPlayer(uint gambllerNum,uint battleNum,uint rebounds,uint asists,uint points ,
      uint blocks,uint steals) public 
      {
        GamblingBattle storage  battle = gamblingBattles[battleNum];
        uint score= rebounds*5+asists *5 +points *10 +blocks* 7+steals *8;
        if (gambllerNum==1){
          battle.scoreUserGamble1+=score; 
        }else{
           battle.scoreUserGamble2+=score; 
        }
      }
      


      function winner(uint battleNum) public view  returns(bool,User memory,bool,User memory)
      {
         GamblingBattle memory battle=gamblingBattles[battleNum];
       
         //delete battle.userGamble1.players;
         //delete battle.userGamble2.players;
         if(battle.scoreUserGamble1>battle.scoreUserGamble2){  
           return (true,battle.userGamble1.user,false,battle.userGamble2.user);
         }else if(battle.scoreUserGamble1< battle.scoreUserGamble2){
            
            return (false,battle.userGamble1.user,true,battle.userGamble2.user);
         }
           return (false,battle.userGamble1.user,false,battle.userGamble2.user);    

       }

     function updateStatisticOfPlayer(string memory _playerName,
    uint _rebounds,uint _asists,uint _points ,uint _blocks,uint _steals) public {
     
      players[_playerName].rebounds+=_rebounds;
      players[_playerName].asists+=_asists;
      players[_playerName].points+=_points;
      players[_playerName].blocks+=_blocks;
      players[_playerName].steals+=_steals;
      
    }
   
   function getBattleNumbers(string memory username) public returns(uint [] memory){
     return userNameToBattle[username];
   }


   
    //------just for test-----//
    
    function getPlayer(string  memory _playername) public view returns(BPlayer memory ){
     return players[_playername];
    }
     function getUserGambllerByUserName(string memory _username)public view returns(UserGamble memory){

           UserGamble memory _userGamble= userGambles[_username];
           return _userGamble;
         
    }
     function getGamblingBattle(uint  battleNum)public view returns(GamblingBattle memory){
        
        //uint[] memory gamblingNumbers=userNameToBattle[username];
        //GamblingBattle[] memory battles=new GamblingBattle[](gamblingNumbers.length);
        //for (uint i=0;i<gamblingNumbers.length;i++){
         GamblingBattle memory battle=gamblingBattles[battleNum];
        
        return battle;
      }
       
      function getUserNameByAddress(address  _userAddress )public view returns(string memory)
      {
        return usersAddress[_userAddress].username;
      }
      function getUserAddressByUsername(string memory username) public view returns(address userAddress){
        return usersMapping[username].userAddress;
      }
}