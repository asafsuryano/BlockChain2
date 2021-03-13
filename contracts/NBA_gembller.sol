// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 < 0.8.0;
pragma experimental ABIEncoderV2;

contract NBA_gembller{
    struct User{
        string firtsName;
        string username;
        string password;
         //address userAddress;
    }
    
 struct BPlayer{
      string name;
      uint rebounds;
      uint asists;
      uint points;
      uint blocks;
      uint steals;
      uint price;
    }
    
    
  struct  UserGamble{
        User user;
        BPlayer []  players;
        uint gambleSum; 
        uint initialPrice;
        bool valid;
    }
    
   
    struct GamblingBattle{
        UserGamble userGamble1;
        UserGamble userGamble2;
        uint scoreUserGamble1;
        uint scoreUserGamble2;
    }

      uint GamblingBattleNum;
      User [] public userWhoWantToGambller;
      mapping(string => UserGamble)  userGambles;
      mapping(string => User) usersMapping;
      mapping(uint => GamblingBattle) gamblingBattles;
      mapping(string => bool) userExists;
      mapping(string=>uint[]) userNameToBattle;
      UserGamble userWaits_0;
      UserGamble userWaits_500;
      UserGamble userWaits_1000;

        

      constructor() public {
        GamblingBattleNum=0;
        userWaits_0.valid=false;
        userWaits_500.valid=false;
        userWaits_1000.valid=false;
        userWaits_0.initialPrice=0;
        userWaits_500.initialPrice=0;
        userWaits_1000.initialPrice=0;
      } 
      
      //return true if the user exsist and the password is correct 
      function login(string memory _username,string memory _password) public view returns (bool)  {
         User memory _user=usersMapping[_username];
         require(keccak256(abi.encodePacked((_user.password))) == keccak256(abi.encodePacked((_password))),"password is not correct ");
         return userExists[_username];
         
        }
       
      function register(string memory firtsName,string  memory username,string  memory password) public  {
        User memory _user=User(firtsName,username,password);
        require(!userExists[_user.username],"user allready exsist");
        usersMapping[username]=_user;
        userExists[_user.username] = true;  
        }

    function addPlayerToUser(string memory username, string memory playerName,
    uint rebounds,uint asists,uint points ,uint blocks,uint steals,uint price) public 
      {
      BPlayer memory _player=BPlayer(playerName,rebounds,asists,points,blocks,steals,price);
      userGambles[username].players.push(_player);

      }
    function addUserGambling(string memory username,uint _initalPrice) public  {        
          userGambles[username].initialPrice=_initalPrice;
          userGambles[username].valid=true;
          User memory _user=usersMapping[username];
          //userGambles[username].gambleSum=calculateGamblePriceWinner();
          if(userGambles[username].initialPrice==userWaits_0.initialPrice){
               if (userWaits_0.valid==false){
               userWaits_0=userGambles[_user.username];
          }else{
             createBattle(_user.username);
           }

          }else if(userGambles[username].initialPrice==userWaits_500.initialPrice){
            if (userWaits_500.valid==false){
               userWaits_500=userGambles[_user.username];
          }else{
             createBattle(_user.username);
           }
          
          
          }else{
            if (userWaits_1000.valid==false){
               userWaits_1000=userGambles[_user.username];
          }else{
             createBattle(_user.username);
          }
        }
    }
      function createBattle(string memory userName)public  {    
        gamblingBattles[GamblingBattleNum].userGamble1= userGambles[userName];  //get the userGamble1
        if ( gamblingBattles[GamblingBattleNum].userGamble1.initialPrice==0){
        gamblingBattles[GamblingBattleNum].userGamble2= userWaits_0;//get the usergamble2
        userWaits_0.valid=false;
        userNameToBattle[userName].push(GamblingBattleNum);
        userNameToBattle[userWaits_0.user.username].push(GamblingBattleNum);
        GamblingBattleNum+=1;
        
        }else if(gamblingBattles[GamblingBattleNum].userGamble1.initialPrice==500){
        gamblingBattles[GamblingBattleNum].userGamble2= userWaits_500;//get the usergamble2   
        userWaits_0.valid=false;
        userNameToBattle[userName].push(GamblingBattleNum);
        userNameToBattle[userWaits_500.user.username].push(GamblingBattleNum);
        GamblingBattleNum+=1;

        }else{
          gamblingBattles[GamblingBattleNum].userGamble2= userWaits_1000;//get the usergamble2
          userWaits_1000.valid=false;
          userNameToBattle[userName].push(GamblingBattleNum);
          userNameToBattle[userWaits_1000.user.username].push(GamblingBattleNum);
          GamblingBattleNum+=1;
        }

      }
      function getGamblingBattle(string memory username)public view returns(GamblingBattle[] memory){
        
        uint[] memory gamblingNumbers=userNameToBattle[username];
        GamblingBattle[] memory battles=new GamblingBattle[](gamblingNumbers.length);
        for (uint i=0;i<gamblingNumbers.length;i++){
          battles[i]=gamblingBattles[gamblingNumbers[i]];
        }
        return battles;
      }

    
    function calculateGamblePriceWinner(uint _price,string memory _username)public view returns(uint){
      UserGamble storage userGamble=userGambles[_username];
      //check if there is length function of the array
      uint sum=0;
      for (uint i=0;i<5;i++){
       sum=sum+calculataPlayerSum(userGamble.players[i]);
      }
      return sum+_price;
    }
    
    function calculataPlayerSum(BPlayer memory player) public view returns(uint)
    {
       uint priceOfPlayer=player.rebounds*10+player.points*5+player.steals*15+player.blocks*15
       +player.asists*10;
       return priceOfPlayer;
    }
     function getUserGambllerByUserName(string memory username)public view returns(UserGamble memory){
          return userGambles[username];
    }
   
      
      
      function calculateDayStatisticsOfPlayer(uint gambllerNum,uint battleNum,uint rebounds,uint asists,uint points ,
      uint blocks,uint steals) public 
      {
        GamblingBattle storage  battle = gamblingBattles[battleNum];
        uint score= rebounds*5+asists *5 +points *10 +blocks* 7+steals *8;
        if (gambllerNum==1){
          //battle.scoreUserGamble1+=score; 
        }else{
           //battle.scoreUserGamble2+=score; 
        }
      }
      

      function winner(uint battleNum) public view returns(UserGamble memory,bool)
      {
        GamblingBattle storage  battle = gamblingBattles[battleNum];
         if(battle.scoreUserGamble1>battle.scoreUserGamble2){
           return (battle.userGamble1,true);
         }else if(battle.scoreUserGamble1< battle.scoreUserGamble2){
           return (battle.userGamble2,true);
         }
           return (battle.userGamble1,false);     
       }

    }
    //function updatePlayerDetails