pragma solidity ^0.5.16;


contract oracle {

    struct stock {

        uint price;

        uint volume;

    }

    

    mapping( bytes4 => stock) stockQuote;

    

    address oracleOwner;


    constructor() public {
        oracleOwner = msg.sender;
    }
    

    function setStock(bytes4 symbol, uint price, uint volume) public returns (uint) {
        require(oracleOwner == msg.sender);
        stock memory stock1 = stock(price,volume);
        stockQuote[symbol] = stock1;
    }

    function getStockPrice(bytes4 symbol) public view returns (uint) {
        return stockQuote[symbol].price;
    }

    function getStockVolume(bytes4 symbol) public view returns (uint) {
        return stockQuote[symbol].volume;
    }

}