const NBA_gambller = artifacts.require("./NBA_gembller.sol");



contract("NBA_gambller", accounts => {
  it("...register a new user .", async () => {
    const nba_gambller = await NBA_gambller.deployed();

    // Set value of 89
    await nba_gambller.register("niv","naory","1223", { from: accounts[0] });
    await nba_gambller.login ("naory","1223", { from: accounts[0] });

    await nba_gambller.createPlayer ("lebron james", 5,10,20 ,1,2,50, { from: accounts[0] });
    await nba_gambller.createPlayer ("luca doncic", 6,10,20 ,1,2,50, { from: accounts[0] });

     await nba_gambller.addPlayerToUser ("naory","lebron james", { from: accounts[0] });
    await nba_gambller.addPlayerToUser ("naory","luca doncic", { from: accounts[0] });
    

    await nba_gambller.addUserGambling("naory",0, { from: accounts[0] });
  

   var userGamble=await nba_gambller.getUserGambllerByUserName("naory", { from: accounts[0] });
    //var player1= await nba_gambller.calculateGamblePriceWinner(0,"naory", { from: accounts[0] });
    console.log(userGamble);
    // await nba_gambller.createPlayer ("luka doncic", 7,9,25 ,3,4,60, { from: accounts[0] });
    // var player=await nba_gambller.getPlayer("luka doncic");
   
    //await nba_gambller.updateStatisticOfPlayer("luka doncic", 1,1,3,1,0,5, { from: accounts[0] });
    // var player1=await nba_gambller.getPlayer("luka doncic");



    
  

    // Get stored value
  //  const storedData = await simpleStorageInstance.get.call();

    //assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
