import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import NBA_gembller from "./contracts/NBA_gembller.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import PlayersInfo from "./resources/nba.json";

class BPlayer extends React.Component{
  constructor(props){
    super(props);
    this.playerStats={name:this.props.info.name,rebounds:this.props.info.rebounds,asists:this.props.info.asists,
      points:this.props.info.points,steals:this.props.info.steals,blocks:this.props.info.blocks,price:this.props.info.price};
    this.state={chosen:false};
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
            this.props.add(this.playerStats);
            if (this.props.canChoose){
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
  }
  addPlayer(BPlayerState){
    if (this.chosenPlayers.length<6){
      this.chosenPlayers.push(BPlayerState);
      this.players.splice(this.players.indexOf(BPlayerState),1);
      if (this.chosenPlayers.length >= 5){
        this.setState({chose_5:true});
      }
    }
  }
  removePlayer(BPlayerState){
    let index=this.chosenPlayers.indexOf(BPlayerState);
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
  render(){
    if (!this.state.chose_5){
      return(
        <div>
          {this.players.map(element=>(
            <BPlayer key={element.name} canChoose={true} info={element} add={this.addPlayer} remove={this.removePlayer}></BPlayer>
          ))}
        </div>
      );
    }else{
      return(
        <div>
        {
          this.players.map(element=>(
            <BPlayer key={element.name} info={element} canChoose={false} add={this.addPlayer} remove={this.removePlayer}></BPlayer>
          ))
        }
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
    this.state={ loggedIn:false,storageValue: 0,register:false,login:false};
    this.web3=null;
    this.accounts=null;
    this.contract=null;
    this.contract2=null;
    this.register=this.register.bind(this);
    this.login=this.login.bind(this);
    this.createGamble=this.createGamble.bind(this);
    this.mainPage=this.mainPage.bind(this);
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
      this.contract=instance;
      this.accounts=accounts;
      this.web3=web3;
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
    for (let i=0;i<chosenPlayers.length;i++){
      await this.contract2.methods.addPlayerToUser(this.state.userLoggedIn,chosenPlayers[i].name,
        chosenPlayers[i].rebounds,chosenPlayers[i].asists,chosenPlayers[i].points,
        chosenPlayers[i].blocks,chosenPlayers[i].steals,chosenPlayers[i].price).send({from:this.accounts[0],gas:'3000000',gasPrice:'0'});
    }
    await this.contract2.methods.addUserGambling(this.state.userLoggedIn,1000).send({from:this.accounts[0],gas:'5000000',gasPrice:'0'});
    this.setState({loggedIn:true,pickBPlayer:false});
  }
  async getGamblesInfo(){
    console.log();
    let ans=await this.contract2.methods.getGamblingBattle(this.state.userLoggedIn).call();
    console.log();
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
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <p>
          {this.state.loggedIn}
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
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
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
  if (this.state.loggedIn && !this.state.pickBPlayer){
    console.log('main menu');
    return(
      <div>
        <button onClick={()=>{this.renderBPlayerList()}}>Choose players for gambling</button>
        <br></br>
        <button onClick={()=>{this.getGamblesInfo()}}>Gambles info</button>
        <br></br>
        <button onClick={()=>{this.setState({loggedIn:false,register:false,login:false,userLoggedIn:''})}}>logout</button>
      </div>
    );
  }
  if (this.state.pickBPlayer){
    return(
      <div>
        <BPlayerList confirm={this.createGamble}></BPlayerList>
      </div>
    )
  }
  }
}


export default App;
