import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import NBA_gembller from "./contracts/NBA_gembller.json";
import DappToken from "./contracts/DappToken.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import PlayersInfo from "./resources/nba.json";

var accountCounter=0;


class BPlayer extends React.Component{
  constructor(props){
    super(props);
    this.playerStats={name:this.props.info.name,rebounds:this.props.info.rebounds,asists:this.props.info.asists,
      points:this.props.info.points,steals:this.props.info.steals,blocks:this.props.info.blocks,price:this.props.info.price};
    this.state={chosen:this.props.chosen};
  }
  render () {
    if (!this.state.chosen){
    return(
      <div className="BPlayer">
        <ul>
          <li>{"name: " + this.playerStats.name}</li>
          <li>{"rebounds: " + this.playerStats.rebounds}</li>
          <li>{"assists: " + this.playerStats.asists}</li>
          <li>{"points: " + this.playerStats.points}</li>
          <li>{"streals: " + this.playerStats.steals}</li>
          <li>{"blocks: " + this.playerStats.blocks}</li>
          <li>{"price: " + this.playerStats.price}</li>
          <button onClick={()=>{
            let ans=this.props.add(this.playerStats);
            if (ans==true){
            this.setState({chosen:!this.state.chosen});
            }
          }}>Choose this Player</button>
        </ul>     
      </div>
      );
    }else{
      return(
        <div className="Chosen">
        <ul>
          <li>{"name: "+this.playerStats.name}</li>
          <li>{"rebounds: "+this.playerStats.rebounds}</li>
          <li>{"assists: "+this.playerStats.asists}</li>
          <li>{"points: "+this.playerStats.points}</li>
          <li>{"streals: "+this.playerStats.steals}</li>
          <li>{"blocks: "+this.playerStats.blocks}</li>
          <li>{"price: "+this.playerStats.price}</li>
          <button onClick={()=>{
          this.props.remove(this.playerStats);
          this.setState({chosen:!this.state.chosen});
          }}>remove player</button>
        </ul>     
      </div>
      );
    }
  }
}
class BPlayerList extends React.Component{
  constructor(props){
    super(props);
    this.chosenPlayers=[];
    this.players=[];
    this.readPlayersJson();
    this.state={chose_5:false};
    this.addPlayer=this.addPlayer.bind(this);
    this.removePlayer=this.removePlayer.bind(this);
    this.getIndexOfPlayerByName=this.getIndexOfPlayerByName.bind(this);
    this.getIndexOfChosenPlayerByName=this.getIndexOfChosenPlayerByName.bind(this);
  }
  addPlayer(BPlayerState){
    if (this.chosenPlayers.length<6){
      this.chosenPlayers.push(BPlayerState);
      let index=this.getIndexOfPlayerByName(BPlayerState.name);
      this.players.splice(index,1);
      if (this.chosenPlayers.length >= 5){
        this.setState({chose_5:true});
      }
      return true;
    }else{
      return false;
    }
  }
  removePlayer(BPlayerState){
    let index=this.getIndexOfChosenPlayerByName(BPlayerState.name);
    if (index > -1){
    let player=this.chosenPlayers[index];
    this.players.push(player);
    this.chosenPlayers.splice(index,1);
    }
    if (this.state.chose_5==true){
      this.setState({chose_5:false});
    }
  }
  readPlayersJson(){
    for (let i=0;i<PlayersInfo.players.length;i++){
      this.players.push(PlayersInfo.players[i]);
    }
  }
  getIndexOfPlayerByName(name){
    for (let i=0;i<this.players.length;i++){
        if (this.players[i].name==name){
          return i;
        }
    }
    return -1;
  }
  getIndexOfChosenPlayerByName(name){
    for (let i=0;i<this.chosenPlayers.length;i++){
      if (this.chosenPlayers[i].name==name){
        return i;
      }
    }
    return -1;
  }
  render(){
    if (!this.state.chose_5){
      return(
        <div>
          {this.players.map(element=>(
            <BPlayer key={element.name} chosen={false} info={element} add={this.addPlayer} remove={this.removePlayer}></BPlayer>
          ))}
          {
            this.chosenPlayers.map(element=>(
            <BPlayer key={element.name} chosen={true} info={element} add={this.addPlayer} remove={this.removePlayer}></BPlayer>
            ))}
        </div>
      );
    }else{
      return(
        <div>
          {this.players.map(element=>(
            <BPlayer key={element.name} chosen={false} info={element} add={this.addPlayer} remove={this.removePlayer}></BPlayer>
          ))}
          { this.chosenPlayers.map(element=>(
            <BPlayer key={element.name} chosen={true} info={element} add={this.addPlayer} remove={this.removePlayer}></BPlayer>
          ))}
        <button onClick={()=>{this.props.confirm(this.chosenPlayers)}}>Confirm selection</button>
        </div>
      )
    }
    
  }
}


class Login extends React.Component{
  constructor(props){
    super(props);
    this.state={username:'',password:''};
  }
  render(){
    return(
          <div className="login_form">
        <form>
          <label for="username">Username</label>
          <input type='text' id="username" onChange={(e)=>this.setState({username:e.target.value,password:this.state.password})}></input>
          <br></br>
          <label for="password">Password</label>
          <input type='password' id="password" onChange={(e)=>this.setState({username:this.state.username,password:e.target.value})}></input>
        </form>
        <br/>
        <button onClick={()=>this.props.login(this.state.username,this.state.password)}>Login</button>
        <button onClick={()=>this.props.back()}>Back to Main page</button>
      </div>
    );
  }
}

class Register extends React.Component{
  constructor(props){
    super(props);
    this.state={firstname:'',username:'',password:''};
  }
  render(){
    return(
      <div className="registration_form">
        <form>
          <label for="name">Name   </label>
          <input type='text' id="name" onChange={(e)=>this.setState({firstname:e.target.value,username:this.state.username,password:this.state.password})}></input>
          <br></br>
          <label for="username">Username    </label>
          <input type='text' id="username" onChange={(e)=>this.setState({firstname:this.state.firstname,username:e.target.value,password:this.state.password})}></input>
          <br></br>
          <label for="password">Password    </label>
          <input type='password' id="password" onChange={(e)=>this.setState({firstname:this.state.firstname,username:this.state.username,password:e.target.value})}></input>
        </form>
        <br/>
        <button onClick={()=>this.props.register(this.state.firstname,this.state.username,this.state.password)}>Register</button>
        <button onClick={()=>this.props.back()}>Back to Main page</button>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={ loggedIn:false,storageValue: 0,register:false,login:false,balance:0,winner:''};
    this.web3=null;
    this.accounts=null;
    this.contract=null;
    this.contract2=null;
    this.contract3=null;
    this.isHaveRivel=null;
    this.balance=0;
    this.register=this.register.bind(this);
    this.login=this.login.bind(this);
    this.createGamble=this.createGamble.bind(this);
    this.mainPage=this.mainPage.bind(this);
    this.decideWinner=this.decideWinner.bind(this);
  }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.contract2=await new web3.eth.Contract(NBA_gembller.abi,NBA_gembller.networks[networkId] && NBA_gembller.networks[networkId].address);
      this.contract3=await new web3.eth.Contract(DappToken.abi,DappToken.networks[networkId] && DappToken.networks[networkId].address);
      this.contract=instance;
      this.accounts=accounts;
      this.web3=web3;
      for (let i=0;i<PlayersInfo.players.length;i++){
        await this.contract2.methods.createPlayer(PlayersInfo.players[i].name,PlayersInfo.players[i].rebounds,
          PlayersInfo.players[i].asists,PlayersInfo.players[i].points,PlayersInfo.players[i].blocks,
          PlayersInfo.players[i].steals).send({from:this.accounts[0],gas:'3000000'});
      }
      let ans=await this.contract2.methods.getPlayer("Luka Doncic ").call();
      console.log(ans);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, await this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    console.log();
  };

  runExample = async () => {
    console.log(this.accounts);
    console.log(this.contract);
    console.log('before send');
    // Stores a given value, 5 by default.
    await this.contract.methods.set(5).send({from: this.accounts[0],gas:'300000',gasPrice:'0'});
    console.log('after send');
    // Get the value from the contract to prove it worked.
    const response = await this.contract.methods.get().call();
    console.log('after call');
    console.log(response);
    // Update state with the result.
    this.setState({ storageValue: response });
  };
  async register(firstname,username,password){
    console.log(this.contract2);
    this.contract2.methods.register(firstname,username,password).send({from:this.accounts[0],gas:'300000',gasPrice:'0'});
    this.setState({storageValue:this.state.storageValue,register:false,login:false});
    this.contract3.methods.addAddress().send({from:this.accounts[accountCounter]});
    accountCounter++;
    console.log('registered');
  }
  mainPage(){
    this.setState({register:false,login:false,loggedIn:false});
  }
  async login(username,password){
    let ans=await this.contract2.methods.login(username,password).call();
    if (ans){
      console.log('login success');
    this.setState({loggedIn:true,storageValue:this.state.storageValue,register:false,login:false,userLoggedIn:username});
    }
  }
  async createGamble(chosenPlayers){
    let userAddress=await this.contract2.methods.getUserAddressByUsername(this.state.userLoggedIn).call();
    for (let i=0;i<chosenPlayers.length;i++){
      await this.contract2.methods.addPlayerToUser(this.state.userLoggedIn,chosenPlayers[i].name)
      .send({from:userAddress,gas:'3000000',gasPrice:'0'});
    }
    this.isHaveRivel=await this.contract2.methods.addUserGambling(this.state.userLoggedIn,1000).send({from:userAddress,gas:'3000000',gasPrice:'0'});
 
    if (this.isHaveRivel.events.readyForBattle==true){
      await this.contract2.methods.createBattle(this.state.userLoggedIn).send({from:userAddress,gas:'5000000'});
      setTimeout(this.decideWinner,10000)

    }
    this.setState({loggedIn:true,pickBPlayer:false});
  }

  async transferToWinner(winnerUsername,loserUsername){
    let winnerAddress=this.contract2.methods.getUserAddressByUsername(winnerUsername).call();
    let loserAddress=this.contract2.methods.getUserAddressByUsername(loserUsername).call();
    let ansTransfer=await this.contract3.methods.transfer(winnerAddress,600).send(
      {from:loserAddress,gas:'3000000'});
    let ans=await this.contract3.methods.getBalance(winnerAddress).call();
    if (this.state.userLoggedIn==winnerUsername){
      this.setState({winner:'you won the gamble'});
    }else{
      this.setState({winner:'you lost the gamble'});
    }
    console.log(ans);
    this.balance=ans.balance;
  }
  async decideWinner(){
    let battleNumbers=await this.contract2.methods.getBattleNumbers(this.state.userLoggedIn).call();
    console.log('hello');
    let ans=await this.contract2.methods.winner(Number(battleNumbers[battleNumbers.length-1])).call();
    if (ans[0]==true){
      this.transferToWinner(ans[1].username,ans[3].username);
    }else if (ans[2]==true){
      this.transferToWinner(ans[3].username,ans[1].username);
    }
    let address=await this.contract2.methods.getUserAddressByUsername(this.state.userLoggedIn).call();
    this.balance=await this.contract3.methods.getBalance(address).call();
  }
  renderBPlayerList(){
    this.setState({pickBPlayer:true});
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (this.state.register==false && this.state.login==false && this.state.loggedIn==false){
      console.log('login/register');
    return (
      <div className="App">
        <button onClick={()=>this.setState({loggedIn:this.state.loggedIn,storageValue:this.state.storageValue,register:true,login:false})}>Register</button>
        <button onClick={()=>this.setState({loggedIn:this.state.loggedIn,storageValue:this.state.storageValue,register:false,login:true})}>Login</button>
      </div>
    );
  }
  if (this.state.register==true){
        return (
      <div className="App">
        <Register register={this.register} back={this.mainPage}></Register>
      </div>
    );
  }
  if (this.state.login){
        return (
      <div className="App">
        <Login login={this.login} back={this.mainPage}></Login>
      </div>
    );
  }
  if (this.state.loggedIn && !this.state.pickBPlayer){
    console.log('main menu');
    return(
      <div className="App">
        <button onClick={()=>{this.renderBPlayerList()}}>Choose players for gambling</button>
        <br></br>
        <button onClick={()=>{this.setState({loggedIn:false,register:false,login:false,userLoggedIn:''})}}>logout</button>
        <h1>{this.state.winner}</h1>
        <h2>{"your balance: "+this.balance}</h2>
      </div>
    );
  }
  if (this.state.pickBPlayer){
    return(
      <div className="App">
        <button onClick={()=>this.setState({pickBPlayer:!this.state.pickBPlayer})}>Back to main menu</button>
        <BPlayerList confirm={this.createGamble}></BPlayerList>
      </div>
    );
  }
  }
}


export default App;
