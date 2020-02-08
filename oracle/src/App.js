import React from "react";
import Web3 from "web3";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quotecontract";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Form from "react-bootstrap/Form";
import Grid from '@material-ui/core/Grid';


const web3 = new Web3("http://localhost:8545");
const stockQuote = new web3.eth.Contract(
  STOCK_ORACLE_ABI,
  STOCK_ORACLE_ADDRESS
);

function App() {
  const [stock, setStock] = React.useState("");
  const [data, setData] = React.useState({});
  const [accounts, setAccounts] = React.useState([]);
  const [price, setPrice] = React.useState(null);
  const [volume, setVolume] = React.useState(null);

  const getAPIdata = async () => {
  
  await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=WFTD1ITEML2U7FWN`
      )
        .then(res => res.json())
        .then(data => {
          if (data["Global Quote"]) {
            setData(data["Global Quote"]);
          }
        })
        .catch(console.error);
  
  };
  React.useEffect(() => {
    const findAccounts = async () => {
      const tempAccounts = await web3.eth.getAccounts();
      setAccounts(tempAccounts);
    };
    findAccounts();
  }, []);

  React.useEffect(() => {
    const Contract = async () => {
      await stockQuote.methods
        .setStock(
          web3.utils.fromAscii(stock),
          Math.round(Number(data["05. price"]) * 100),
          Number(data["06. volume"])
        )
        .send({ from: accounts[0] });
      setData({});
    };

    const fromContract = async () => {
      var getPrice = await stockQuote.methods.getStockPrice(web3.utils.fromAscii(stock)).call();
      var getVolume = await stockQuote.methods.getStockVolume(web3.utils.fromAscii(stock)).call();

      setVolume(Number(getVolume));
      setPrice(getPrice / 100);
    };

    if (Object.keys(data).length !== 0 && stock.length !== 0) {
      Contract();
      setTimeout(fromContract, 500); 
    }
  }, [data, stock, accounts]);

  const Data = (
    <div className="output-data">
      <p>
        <Typography variant='h6'>
          {`Price: ${price}`}
        </Typography>
      </p>
      <box m={1} />
      <p>
        <Typography variant='h6'>
          {`Volume: ${volume}`}
        </Typography>
      </p>
    </div>
  )
  

  return (
    <div className="App">
      <Form>
      <Grid container direction='row' justify='center' alignItems='center'>
      <Grid item xs={1}>
        <Box m={4} />
          <Typography variant='h4'>Stocks</Typography>
          <Box m={4} />
          <Form.Control
            type="symbol"
            placeholder="Stock Symbol"
            value={stock}
            onChange={event => {
              setStock(event.target.value.slice(0, 4).toUpperCase());
            }}
          />
          </Grid>
          </Grid>
      </Form>
      <Box m={2} />
      <Button onClick={getAPIdata} disabled={!stock}>Submit</Button>
      <Box m={2} />
      {price !== null && volume !== null && Data}
      {price == null && volume == null && "Cant find stock"}
    </div>
  );
}

export default App;

