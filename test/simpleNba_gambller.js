const NBA_gambller = artifacts.require("./NBA_gembller.sol");



contract("NBA_gambller", accounts => {
  it("...register a new user .", async () => {
    const nba_gambller = await NBA_gambller.deployed();
     


    //player 1
    await nba_gambller.register("niv","naory","1223",accounts[0], { from: accounts[0] });
    await nba_gambller.login ("naory","1223", { from: accounts[0] });
    

    //player 2
    await nba_gambller.register("asaf","suryano","1332",accounts[1],{ from: accounts[1] });
    await nba_gambller.loginWithAddress(accounts[1]);
    
    
    await nba_gambller.createPlayer ("lebron james", 5,10,20 ,1,2, { from: accounts[0] });
    await nba_gambller.createPlayer ("luca doncic", 6,10,20 ,1,2, { from: accounts[0] });
    await nba_gambller.createPlayer ("dwyane wade", 4,10,15 ,3,4,{ from: accounts[0] });
    await nba_gambller.createPlayer ("Myles turner",15,3,10 ,1,5, { from: accounts[0] });
      


    //add playes to user 1
     await nba_gambller.addPlayerToUser ("naory","lebron james", { from: accounts[0] });
     await nba_gambller.addPlayerToUser ("naory","luca doncic", { from: accounts[0] });
    

     //add players to user 2
     await nba_gambller.addPlayerToUser("suryano","dwyane wade", { from: accounts[1] });
     await nba_gambller.addPlayerToUser("suryano","Myles turner", { from: accounts[1] });
     
     

    await nba_gambller.addUserGambling("naory",0, { from: accounts[0] });
    await nba_gambller.addUserGambling("suryano",0, { from: accounts[1] });



   await nba_gambller.createBattle("suryano" ,{ from: accounts[0] });
    
    
   var user= await nba_gambller.getUserGambllerByUserName("naory",{ from: accounts[0] });
  
    
  


   //for player 1
   await nba_gambller.calculateDayStatisticsOfPlayer(1,1,7,3,25,
    2,1,{ from: accounts[0] });

   await nba_gambller.calculateDayStatisticsOfPlayer(1,1,7,3,25,
    2,4,{ from: accounts[0] });

    //for player 2
    await nba_gambller.calculateDayStatisticsOfPlayer(2,1,7,3,25,
    2,3,{ from: accounts[0] });

    await nba_gambller.calculateDayStatisticsOfPlayer(2,1,7,3,25,
    2,5,{ from: accounts[0] });

    var winner=await nba_gambller.winner(1,{ from: accounts[0] });
   
    if (winner[1]==true){
      console.log(winner[0]);
    }else{
      console.log(winner[2]);
    }

  });
});
