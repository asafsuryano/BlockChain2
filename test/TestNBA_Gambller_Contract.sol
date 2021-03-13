pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NBA_gembller.sol";

contract TestNBA_Gambller_Contract {
  function testItStoresAValue() public {
    NBA_gembller nba_gambller = NBA_gembller(DeployedAddresses.NBA_gembller());
     
    //nba_gambller.register("niv", "naory", "12");
    //nba_gambller.register("niv", "naory", "12");
    
    
    /*
    NBA_gembller.set(89);

    uint expected = 89;

    Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
    */
  }

}
