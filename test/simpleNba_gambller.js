const NBA_gambller = artifacts.require("./NBA_gembller.sol");



contract("NBA_gambller", accounts => {
  it("...register a new user .", async () => {
    const nba_gambller = await NBA_gambller.deployed();

    // Set value of 89
    await nba_gambller.register("niv","naory","1223", { from: accounts[0] });
    await nba_gambller.login ("naory","1223", { from: accounts[0] });
   


    // Get stored value
  //  const storedData = await simpleStorageInstance.get.call();

    //assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
