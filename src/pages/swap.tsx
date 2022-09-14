import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import { OptionIcon } from '@/components/icons/option';
import { InfoCircle } from '@/components/icons/info-circle';
import CoinInput from '@/components/ui/coin-input';
import TransactionInfo from '@/components/ui/transaction-info';
import LineChart from '@/components/ui/line-chart';
import { SwapIcon } from '@/components/icons/swap-icon';
import { ChevronDown } from '@/components/icons/chevron-down';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import AllTokens from '@/components/ui/all-tokens';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@/components/ui/transition';
import NftDropDown from '@/components/nft/nft-dropdown';
import Image from '@/components/ui/image';
import { coinList } from '@/data/static/coin-list';
import Scrollbar from '@/components/ui/scrollbar';
import DashboardLayout from '@/layouts/_dashboard';
import Layout from '@/layouts/_layout';
import TradeContainer from '@/components/ui/trade';
import { useModal } from '@/components/modal-views/context';
import { atom, useAtom } from 'jotai';
import { useTextAtom } from '@/components/swap/settings';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { ethers } from 'ethers';
import ERC20 from '@/abi/ERC20.json';
import VixRouter from '@/abi/VixRouter.json';

// Create your atoms and derivatives
var routingAtom, toSettingsAtom, pricesAtom;
export function useRoutingAtom() {
  return { routingAtom };
}
export function useSettingsAtom() {
  return { toSettingsAtom };
}
export function usePricesAtom() {
  return { pricesAtom };
}

const sort1 = [
  { id: 1, name: 'All Types' },
  { id: 2, name: 'Limit' },
  { id: 3, name: 'Stop-Limit' },
];
function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort1[0]);

  return (
    <div className="relative w-full">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className=" flex h-full items-center rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-[#161b1d] dark:text-white">
          <div className="mr-2">{selectedItem.name}</div>
          <ChevronDown />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute left-0 z-10 mt-2 w-[120px] origin-top-right rounded-md bg-white shadow-large dark:bg-[#303030]">
            {sort1.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-md px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-gray-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

const sort2 = [
  { id: 1, name: 'All Statuses' },
  { id: 2, name: 'Open' },
  { id: 3, name: 'Expired' },
  { id: 4, name: 'Failed' },
];
function SortList2() {
  const [selectedItem, setSelectedItem] = useState(sort2[0]);

  return (
    <div className="relative w-full">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className=" flex h-full items-center rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-[#161b1d] dark:text-white">
          <div className="mr-2">{selectedItem.name}</div>
          <ChevronDown />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute left-0 z-10 mt-2 w-[120px] origin-top-right rounded-md bg-white shadow-large dark:bg-[#303030]">
            {sort2.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-md px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-gray-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

const SwapPage: NextPageWithLayout = () => {
  //new
  const [balance, setBalance] = useState<String | undefined>();

  useEffect(() => {
    const myfunc = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const { chainId } = await provider.getNetwork();
      // console.log(chainId)
      const signer = provider.getSigner();
      let userAddress = await signer.getAddress();
      // console.log(userAddress)

      if (chainId != 43114) await swtichNetwork();
    };
    // myfunc();
  });
  const tempadapternames = {
    '0x623DC9E82F055471B7675503e8deF05A35EBeA19': 'Trader Joe',
    '0xeE57D82AA7c1f6Edb1aa63219828A55b1CAC2786': 'Pangolin',
    '0x1b013c840f4b8BFa1cEaa7dd5f31d1f234C56A54': 'Sushiswap',
    '0x4c90a08eab5DBAD079Abc165C29c1A32dDEf2beC': 'ElkFinance',
    '0x7F8B47Ff174Eaf96960a050B220a907dFa3feD5b': 'GMX',
    '0xd0f6e66113A6D6Cca238371948F4Ce2893D62881': 'Curve',
  };

  const getCoinName = (address: string) => {
    const index = coinList.findIndex(
      (item) => item.address.toLowerCase() === address.toLowerCase()
    );
    if (index !== -1) {
      return coinList[index].name;
    } else {
      return 'Unknown';
    }
  };

  const getCoinDecimals = (address: string) => {
    const index = coinList.findIndex((item) => item.address === address);
    if (index !== -1) {
      return coinList[index].decimals;
    } else {
      return 18;
    }
  };

  const [settings, setSettings] = useState({});
  const [marketData, setMarketData] = useState({});

  const [tokenInIndex, setTokenInIndex] = useState(0);
  const [tokenInPrice, setTokenInPrice] = useState(0);
  const [tokenIn, setTokenIn] = useState('');

  const [tokenOutIndex, setTokenOutIndex] = useState(1);
  const [tokenOutPrice, setTokenOutPrice] = useState(0);
  const [tokenOut, setTokenOut] = useState('');

  const [amountIn, setAmountIn] = useState(1);
  const [amountOut, setAmountOut] = useState(0);
  const [adapter, setAdapter] = useState('');

  const [adapters, setAdapters] = useState([]);
  const [path, setPath] = useState([]);
  const [amounts, setAmounts] = useState([]);

  const [tempdev] = useState(false);

  routingAtom = atom({
    adapters: [
      '0x623DC9E82F055471B7675503e8deF05A35EBeA19',
      '0xeE57D82AA7c1f6Edb1aa63219828A55b1CAC2786',
    ],
    path: [
      '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    ],
  });

  useEffect(() => {
    setTokenIn(coinList[tokenInIndex].address);
  }, [tokenInIndex]);

  useEffect(() => {
    setTokenOut(coinList[tokenOutIndex].address);
  }, [tokenOutIndex]);

  useEffect(() => {
    const getAmountOut = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const vixrouterContract = new ethers.Contract(
          VixRouter.address,
          VixRouter.abi,
          signer
        );
        var inamount = ethers.utils.parseUnits(
          String(amountIn),
          getCoinDecimals(tokenIn)
        );
        // let { amountOut, adapter } = await vixrouterContract.queryNoSplit(inamount, tokenIn, tokenOut);
        // amountOut = ethers.utils.formatUnits(amountOut, getCoinDecimals(tokenOut));
        // console.log("@@@@@@@@@ Query", amountIn, getCoinName(tokenIn), "=>", amountOut, getCoinName(tokenOut), " || ", tempadapternames[adapter])

        console.log(amountIn, tokenIn, tokenOut);
        let { adapters, path, amounts } = await vixrouterContract.findBestPath(
          inamount,
          tokenIn,
          tokenOut,
          4
        );
        setAdapters(adapters);
        setPath(path);
        setAmounts(amounts);
        console.log(adapters, path, amounts);
        var final_amount = Number(
          ethers.utils.formatUnits(
            amounts[amounts.length - 1],
            getCoinDecimals(tokenOut)
          )
        );
        setAmountOut(final_amount);
      } catch (e) {
        console.log(e);
      }
    };
    getAmountOut();
  }, [tokenIn, tokenOut, amountIn]);

  // angel work
  useEffect(() => {
    const getPrice = async () => {
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinList[tokenInIndex].coinGeckoCoinsId}`
        );
        const currentPrice = data?.market_data.current_price.usd;
        const price_change = data?.market_data.price_change_24h_in_currency.usd;
        const price_change_p1 =
          data?.market_data.price_change_percentage_24h_in_currency.usd;
        const price_change_p7 =
          data?.market_data.price_change_percentage_7d_in_currency.usd;
        const market_cap = data?.market_data.market_cap.usd;
        const market_cap_change_p =
          data?.market_data.market_cap_change_percentage_24h_in_currency.usd;
        const total_supply = data?.market_data.total_supply;
        const total_volume = data?.market_data.total_volume.usd;
        setMarketData({
          currentPrice: currentPrice.toFixed(3),
          price_change: price_change.toFixed(5),
          price_change_p1: price_change_p1.toFixed(3),
          price_change_p7: price_change_p7.toFixed(3),
          market_cap: market_cap.toLocaleString('en-US'),
          market_cap_change_p: market_cap_change_p.toFixed(3),
          total_supply: total_supply.toLocaleString('en-US'),
          total_volume: total_volume.toLocaleString('en-US'),
        });
        setTokenInPrice(currentPrice);
      } catch (err) {
        console.error(err.message);
      }
    };
    getPrice();
  }, [tokenInIndex]);

  useEffect(() => {
    const getPrice = async () => {
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinList[tokenOutIndex].coinGeckoCoinsId}`
        );
        const currentPrice = data?.market_data.current_price.usd;
        setTokenOutPrice(currentPrice);
      } catch (err) {
        console.error(err.message);
      }
    };
    getPrice();
  }, [tokenOutIndex]);

  const [hours, setHours] = useState('24');
  const [interval, setInterval] = useState('32');
  const [timePrices1, setTimePrices1] = useState([]);
  const [timePrices2, setTimePrices2] = useState([]);
  
  useEffect(() => {
    const getPrice = async () => {
      try {
        const xhours = Number(hours);
        console.log('xhours => ', xhours);
        console.log('to => ', Date.now());
        const to = Math.round(new Date().getTime() / 1000);
        const xHourAgo = (xhours) => {
          const date = new Date();
          const timeAgo = Math.round(
            date.setTime(date.getTime() - xhours * 60 * 60 * 1000) / 1000
          );
          return timeAgo;
        };
        
        const from = xHourAgo(xhours);
        console.log('fromt => ', from);
        const response1 = await axios.get(
          `https://api.coingecko.com/api/v3/coins/avalanche/contract/${coinList[tokenInIndex].address}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
        );
        console.log('data1 => ', response1?.data);
        const response2 = await axios.get(
          `https://api.coingecko.com/api/v3/coins/avalanche/contract/${coinList[tokenOutIndex].address.toLowerCase()}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
        );
        console.log('data2 => ', response2?.data);
        setTimePrices1(response1?.data.prices);
        setTimePrices2(response2?.data.prices);
      } catch (err) {
        console.error(err.message);
      }
    };
    getPrice();
  }, [hours, tokenInIndex, tokenOutIndex]);

  let [toggleCoin, setToggleCoin] = useState(false);
  const toggleTokens = () => {
    var dish = tokenInIndex;
    setTokenInIndex(tokenOutIndex);
    setTokenOutIndex(dish);
    setToggleCoin(!toggleCoin);
  };

  const { settingsAtom } = useTextAtom();
  const [txSpeed, setTxSpeed] = useState('');
  const [tolerance, setTolerance] = useState('');
  toSettingsAtom = atom({ speed: txSpeed, tol: tolerance });

  useEffect(() => {
    if (settingsAtom?.init.txSpeed) {
      setTxSpeed(settingsAtom?.init.txSpeed);
    }
  }, [settingsAtom?.init.txSpeed]);
  useEffect(() => {
    if (settingsAtom?.init.tolerance) {
      setTolerance(settingsAtom?.init.tolerance);
    }
  }, [settingsAtom?.init.tolerance]);

  const swap = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();

    //approve
    const tokenContract = new ethers.Contract(tokenIn, ERC20.abi, signer);
    var balance = await tokenContract.balanceOf(userAddress);
    if (
      Number(ethers.utils.formatUnits(balance, getCoinDecimals(tokenIn))) <
      amountIn
    ) {
      alert('Not enough balance');
      return;
    }
    var approved_amount = await tokenContract.allowance(
      userAddress,
      VixRouter.address
    );
    if (
      Number(
        ethers.utils.formatUnits(approved_amount, getCoinDecimals(tokenIn))
      ) < amountIn
    ) {
      var approving_amount = ethers.utils.parseUnits(
        '9999999',
        getCoinDecimals(tokenIn)
      );
      await tokenContract.approve(VixRouter.address, approving_amount);
    }

    //swap
    const vixrouterContract = new ethers.Contract(
      VixRouter.address,
      VixRouter.abi,
      signer
    );
    var parsed_amountIn = ethers.utils.parseUnits(
      String(amountIn),
      getCoinDecimals(tokenIn)
    );
    var parsed_amountOut = ethers.utils.parseEther('0');
    var _trade = [parsed_amountIn, parsed_amountOut, path, adapters];
    var _to = userAddress;
    var _fee = ethers.utils.parseEther('0');
    await vixrouterContract.swapNoSplit(_trade, _to, _fee);
  };

  const swtichNetwork = async () => {
    console.log('swtichNetwork');
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa86a' }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xa86a',
                chainName: 'Avalanche C-Chain',
                nativeCurrency: {
                  name: 'AVAX',
                  symbol: 'AVAX',
                  decimals: 18,
                },
                rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'] /* ... */,
                blockExplorerUrls: ['https://snowtrace.io'],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
    window.location.reload();
  };

  //old
  const { openModal } = useModal();

  return (
    <>
      <NextSeo
        title="Apexswap - Trade"
        description="Apexswap - Avalanche DEX"
      />
      <div className="xl:grid-rows-7 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {/* Swap box min-w-[410px] max-w-[410px] */}
        <div className="xl:col-span-1 xl:row-span-5 xl:row-start-1 xl:row-end-6">
          <TradeContainer>
            <div className=" dark:border-gray-800 xs:mb-2 xs:pb-6 ">
              <div className="my-4 flex w-[105%] flex-row justify-between">
                <div className="grid grid-cols-1 place-items-center">
                  <div className="font-medium">Dex Aggregator</div>
                </div>
                <div className="flex flex-row pr-5">
                  <InfoCircle
                    className="mr-3 h-auto w-4"
                    style={{ cursor: 'pointer' }}
                  />
                  <OptionIcon
                    className="mr-1 h-auto w-4"
                    onClick={() => {
                      openModal('SETTINGS');
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
              <div>
                <CoinInput
                  label={'You Pay'}
                  usdPrice={tokenInPrice}
                  defaultValue={amountIn}
                  defaultCoinIndex={tokenInIndex}
                  onChangeTokenIndex={(tokenIndex) => {
                    setTokenInIndex(tokenIndex);
                  }}
                  onchangeAmount={setAmountIn}
                  onToggleTokens={toggleCoin}
                />
                <div className="my-2 grid grid-cols-1 place-items-center">
                  <Button
                    size="mini"
                    color="info"
                    shape="circle"
                    variant="transparent"
                    className="uppercase xs:tracking-widest"
                    onClick={() => {
                      toggleTokens();
                    }}
                  >
                    <SwapIcon className="h-auto w-3" />
                  </Button>
                </div>
                <CoinInput
                  label={'You Receive'}
                  editable={true}
                  usdPrice={tokenOutPrice}
                  defaultValue={amountOut}
                  defaultCoinIndex={tokenOutIndex}
                  onToggleTokens={toggleCoin}
                  onChangeTokenIndex={setTokenOutIndex}
                  showvalue={amountOut}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 px-2 xs:gap-[18px]">
              <TransactionInfo
                label={'Savings'}
                value={`~$${Number(tokenOutPrice * amountOut * 0.02).toFixed(
                  3
                )}`}
              />
              <TransactionInfo
                label={'Min. Received'}
                value={`${
                  amountOut ? Number(amountOut * 0.99).toFixed(2) : 0
                } ${coinList[tokenOutIndex].code}`}
              />
              <TransactionInfo
                label={'Rate'}
                value={`${(amountOut / amountIn).toFixed(2)} ${
                  coinList[tokenOutIndex].code
                }/${coinList[tokenInIndex].code}`}
              />
              <TransactionInfo label={'TxSpeed'} value={txSpeed} />
              <TransactionInfo label={'Price Slippage'} value={tolerance} />
              <TransactionInfo label={'Network Fee'} value={'0.04$'} />
            </div>
            <div className="mt-6 flex w-[105%] flex-row justify-between px-2">
              <div className="grid grid-cols-1 place-items-center">
                <div className="text-sm">Route</div>
              </div>
              <div className="flex flex-row">
                <div
                  className="pr-5 text-sm"
                  onClick={() => {
                    openModal('ROUTING');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {adapters.length} steps in the route
                </div>
              </div>
            </div>
            <Button
              size="large"
              id=""
              shape="rounded"
              fullWidth={true}
              className=" mt-3 uppercase dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 xs:mt-4 xs:tracking-widest"
              onClick={() => {
                swap();
              }}
            >
              SWAP
            </Button>

            <br></br>
            <br></br>
            <h1>
              Dex:{' '}
              {adapters.map((ele, i) => {
                return (i ? ' ->' : '') + tempadapternames[ele];
              })}
            </h1>
            <br></br>
            <h1>
              Coin:{' '}
              {path.map((ele, i) => {
                return (i ? ' ->' : '') + getCoinName(ele);
              })}
            </h1>
            {tempdev ? (
              <div>
                <br></br>
                <hr></hr>
                <h1>tokenInIndex: {tokenInIndex}</h1>
                <h1>tokenIn: {getCoinName(tokenIn)}</h1>
                <h1>Amount: {amountIn}</h1>
                <h1>Price: {tokenInPrice}</h1>
                <hr></hr>
                <h1>tokenOutIndex: {tokenOutIndex}</h1>
                <h1>tokenOut: {getCoinName(tokenOut)}</h1>
                <h1>Amount: {amountOut}</h1>
                <h1>Price: {tokenOutPrice}</h1>
                <hr></hr>
                <h1>
                  adapters:
                  {adapters.map((ele, i) => {
                    return (i ? ' ->' : '') + tempadapternames[ele];
                  })}
                </h1>
                <h1>
                  Coin path:{' '}
                  {path.map((ele, i) => {
                    return (i ? ' ->' : '') + getCoinName(ele);
                  })}
                </h1>
                <h1>
                  amounts:
                  {amounts.length}:{' '}
                  {amounts.map((ele, index) => {
                    return (
                      ' ->' +
                      ethers.utils.formatUnits(
                        ele,
                        getCoinDecimals(path[index])
                      )
                    );
                  })}
                </h1>
              </div>
            ) : (
              <></>
            )}
          </TradeContainer>
        </div>

        {/* Trading View */}
        <div className="xl:row-end-8 xl:row-span-7 text-large mt-5 w-full rounded-lg border border-[#374151] pb-5 text-center shadow-card dark:bg-[#161b1d] xs:mb-2 xs:pb-6 xl:col-span-3 xl:row-start-1">
          <div className="flex min-h-[50px] flex-row border-b border-b-[#374151]">
            <div className="flex items-center p-2">
              {coinList[tokenInIndex].icon}
              <span className="ml-4 text-xl">
                {coinList[tokenInIndex].name}
              </span>
            </div>
            <div className=" flex">
              <div className="mr-4 flex items-center px-2">
                <div className="flex flex-col">
                  <span className="text-left text-lg font-semibold">
                    $ {marketData.currentPrice}
                  </span>
                  {/* <span className="text-left text-xs text-green-400">
                    {0.31}%
                  </span> */}
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-1/3 w-[5px] border-l border-l-[#374151]"></div>
              </div>
              <div className="ml-4 flex items-center">
                <div className="flex flex-col">
                  <span className="text-left text-xs text-[#8d8d8d]">
                    24h Price Change(USD)
                  </span>
                  <div className="flex items-center">
                    <span className="text-left text-sm">
                      ${marketData.price_change}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        marketData.price_change_p1 > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      )}
                    >{`(${marketData.price_change_p1}%)`}</span>
                  </div>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="text-left text-xs text-[#8d8d8d]">
                    Fully Dilluted Market Cap
                  </span>
                  <div className="flex items-center">
                    <span className="text-left text-sm">
                      ${marketData.market_cap}
                    </span>
                    <span
                      className={cn(
                        'text-xs',
                        marketData.market_cap_change_p > 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      )}
                    >
                      {`(${marketData.market_cap_change_p}%)`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="text-left text-xs text-[#8d8d8d]">
                    Total Supply
                  </span>
                  <span className="text-left text-sm">
                    ${marketData.total_supply}
                  </span>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="text-left text-xs text-[#8d8d8d]">
                    Total Volume
                  </span>
                  <span className="text-left text-sm">
                    ${marketData.total_volume}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-x divide-[#374151] lg:grid-cols-4">
            <div className="grid grid-cols-1 divide-y divide-[#374151] lg:col-span-3">
              <div className="mb-2 min-h-[420px]">
                {/* <AdvancedRealTimeChart
                  theme="dark"
                  height="97%"
                  width="100%"
                  symbol={`${coinList[tokenInIndex].tradingviewcode}USD`}
                  interval="1"
                ></AdvancedRealTimeChart> */}
                <div className="mt-5 mb-2 flex flex-row-reverse">
                  <div className="inline-flex rounded-md shadow-sm mr-3" role="group">
                    <button
                      type="button"
                      className={cn("rounded-l-lg border border-gray-900 bg-transparent py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white focus:ring-gray-500 dark:border-[#374151] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
                        hours === '1'? 'dark:bg-cyan-600/50' : 'dark:focus:bg-gray-700'
                      )}
                      onClick={() => {setHours('1'); setInterval('2')}}
                    >
                      1hr
                    </button>
                    <button
                      type="button"
                      className={cn("border-t border-b border-r border-gray-900 bg-transparent py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white focus:ring-gray-500 dark:border-[#374151] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
                        hours === '12'? 'dark:bg-cyan-600/50' : 'dark:focus:bg-gray-700'
                      )}
                      onClick={() => {setHours('12'); setInterval('16')}}
                    >
                      12hr
                    </button>
                    <button
                      type="button"
                      className={cn("border-t border-b border-r border-gray-900 bg-transparent py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white focus:ring-gray-500 dark:border-[#374151] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
                        hours === '24'? 'dark:bg-cyan-600/50' : 'dark:focus:bg-gray-700'
                      )}
                      onClick={() => {setHours('24'); setInterval('32')}}
                    >
                      1 d
                    </button>
                    <button
                      type="button"
                      className={cn("border-t border-b border-r border-gray-900 bg-transparent py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white focus:ring-gray-500 dark:border-[#374151] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
                        hours === '168'? 'dark:bg-cyan-600/50' : 'dark:focus:bg-gray-700'
                      )}
                      onClick={() => {setHours('168'); setInterval('32')}}
                    >
                      1 w
                    </button>
                    <button
                      type="button"
                      className={cn("border-t border-b border-gray-900 bg-transparent py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white focus:ring-gray-500 dark:border-[#374151] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
                        hours === '720'? 'dark:bg-cyan-600/50' : 'dark:focus:bg-gray-700'
                      )}
                      onClick={() => {setHours('720'); setInterval('32')}}
                    >
                      1 m
                    </button>
                    <button
                      type="button"
                      className={cn("rounded-r-md border border-gray-900 bg-transparent py-1 px-2 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:bg-gray-900 focus:text-white focus:ring-gray-500 dark:border-[#374151] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
                        hours === '4320'? 'dark:bg-cyan-600/50' : 'dark:focus:bg-gray-700'
                      )}
                      onClick={() => {setHours('4320'); setInterval('32')}}
                    >
                      6 m
                    </button>
                  </div>
                </div>
                <LineChart timeprices1={timePrices1} timeprices2={timePrices2} interval={interval} tokenIn={coinList[tokenInIndex].name} tokenOut={coinList[tokenOutIndex].name} />
              </div>
              <div className="">
                <div className="mt-6 w-full shrink">
                  <div className="mt-1 w-full shrink lg:flex lg:flex-row lg:justify-between">
                    <div className="flex max-w-[40%] shrink flex-row px-4">
                      <Button
                        size="mini"
                        color="primary"
                        shape="rounded"
                        variant="transparent"
                        className="text-sm xs:tracking-widest"
                      >
                        Active Orders
                      </Button>
                      <Button
                        size="mini"
                        color="gray"
                        shape="rounded"
                        variant="ghost"
                        className="mx-1 text-sm xs:tracking-widest"
                      >
                        Order History
                      </Button>
                    </div>
                    <div className="flex shrink flex-row items-center px-4">
                      <div className=" flex flex-row items-center">
                        <SortList />
                      </div>
                      <div className="mx-5 flex flex-row items-center">
                        <SortList2 />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 h-[200px] max-h-[220px] w-full px-8">
                  <Scrollbar style={{ height: 'calc(100% - 32px)' }}>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left' }}>Token Pair</th>
                          <th>Amount</th>
                          <th>Limit Price</th>
                          <th>Filled Price</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th style={{ textAlign: 'right' }}>Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <tr>
                          <td style={{ textAlign: 'left' }}>{coinList[0].code} / {coinList[1].code}</td>
                          <td>1.3 {coinList[0].code}</td>
                          <td>1580</td>
                          <td>1588</td>
                          <td>completed</td>
                          <td>2022-9-3 1:27:46</td>
                          <td style={{ textAlign: 'right' }}>0.0014 {coinList[0].code}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'left' }}>{coinList[0].code} / {coinList[1].code}</td>
                          <td>1.5 {coinList[0].code}</td>
                          <td>1580</td>
                          <td></td>
                          <td>pending</td>
                          <td>2022-9-3 1:27:46</td>
                          <td style={{ textAlign: 'right' }}>0.0014 {coinList[0].code}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'left' }}>{coinList[0].code} / {coinList[1].code}</td>
                          <td>1.4 {coinList[0].code}</td>
                          <td>1580</td>
                          <td></td>
                          <td>pending</td>
                          <td>2022-9-3 1:27:46</td>
                          <td style={{ textAlign: 'right' }}>0.0014 {coinList[0].code}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'left' }}>{coinList[0].code} / {coinList[1].code}</td>
                          <td>1.4 {coinList[0].code}</td>
                          <td>1580</td>
                          <td></td>
                          <td>pending</td>
                          <td>2022-9-3 1:27:46</td>
                          <td style={{ textAlign: 'right' }}>0.0014 {coinList[0].code}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'left' }}>{coinList[0].code} / {coinList[1].code}</td>
                          <td>1.4 {coinList[0].code}</td>
                          <td>1580</td>
                          <td></td>
                          <td>pending</td>
                          <td>2022-9-3 1:27:46</td>
                          <td style={{ textAlign: 'right' }}>0.0014 {coinList[0].code}</td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'left' }}>{coinList[0].code} / {coinList[1].code}</td>
                          <td>1.4 {coinList[0].code}</td>
                          <td>1580</td>
                          <td></td>
                          <td>pending</td>
                          <td>2022-9-3 1:27:46</td>
                          <td style={{ textAlign: 'right' }}>0.0014 {coinList[0].code}</td>
                        </tr> */}
                      </tbody>
                    </table>
                  </Scrollbar>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 ">
              <div className="flex min-h-[50px] w-full items-center justify-around border-b border-b-[#374151]">
                <Button
                  size="mini"
                  color="gray"
                  shape="rounded"
                  variant="ghost"
                  className="mx-1 w-[90%] text-sm xs:tracking-widest"
                >
                  Favorites
                </Button>
                <Button
                  size="mini"
                  color="gray"
                  shape="rounded"
                  variant="ghost"
                  className="mx-1 w-[90%] text-sm xs:tracking-widest"
                >
                  My Wallet
                </Button>
                <Button
                  size="mini"
                  color="primary"
                  shape="rounded"
                  variant="transparent"
                  className="w-[90%] text-sm xs:tracking-widest"
                >
                  Market
                </Button>
              </div>
              <div className="flex resize-y flex-col divide-y divide-[#374151]">
                <div className="text-xs">
                  <ParamTab
                    tabMenu={[
                      {
                        title: 'All Tokens',
                        path: 'tokens',
                      },
                      {
                        title: 'Imported',
                        path: 'imported',
                      },
                      {
                        title: 'DeFi',
                        path: 'defi',
                      },
                    ]}
                  >
                    <Scrollbar style={{ height: 'calc(100% - 32px)' }}>
                      <TabPanel className="h-[240px] max-h-[240px] focus:outline-none">
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'ETH'}
                                  to={'USDT'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'ETH'}
                                  to={'USDT'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'ETH'}
                                  to={'USDC'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'BTC'}
                                  to={'USDT'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'ETH'}
                                  to={'USDT'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'BTC'}
                                  to={'USDT'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div className="w-3/5">
                            <div className="mb-2 text-xs text-gray-900 dark:text-white">
                              <div className="px-1">
                                <AllTokens
                                  from={'BTC'}
                                  to={'USDT'}
                                  price={174655397.13}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-2/5">
                            <div className=" mb-2 flex flex-col">
                              <span className="pr-1 text-right text-sm dark:text-white">
                                ${273.815}
                              </span>
                              <div className="mt-1 px-1 text-right text-xs text-red-400 text-gray-900">
                                {-3.04}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </Scrollbar>
                    <TabPanel className="h-[240px] max-h-[240px] focus:outline-none">
                      <div className="space-y-6">
                        <div className="block">
                          <div className="mb-2 text-xs text-gray-900 dark:text-white">
                            Imported
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel className="h-[240px] max-h-[240px] focus:outline-none">
                      <div className="space-y-6">
                        <div className="block">
                          <div className="mb-2 text-xs text-gray-900 dark:text-white">
                            DeFi
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </ParamTab>
                </div>
                <div className="">
                  <div className="w-full px-4 py-2 text-left">Market Trade</div>
                  <div className="flex flex-row items-center px-2 pb-1">
                    <div className="w-[35%] text-right text-xs text-stone-400">
                      <span>Price</span>
                      <span>(USD)</span>
                    </div>
                    <div className="w-[35%] text-right text-xs text-stone-400">
                      Total(USD)
                    </div>
                    <div className="w-[30%] text-right text-xs text-stone-400">
                      Time
                    </div>
                  </div>
                  <Scrollbar style={{ height: 'calc(100% - 32px)' }}>
                    <div className="flex h-[460px] max-h-[480px] w-full flex-col px-2">
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.809
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          2.97
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          116.01
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          122.71
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          232.26
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          82.84
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          132.62
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          212.53
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:28:04
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:28:04
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:28:04
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:28:04
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:28:04
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          232.47
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:28:04
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-green-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-green-400">
                          82.84
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          132.62
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.810
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.910
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.710
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.710
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.710
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.710
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                      <div className="flex flex-row text-sm">
                        <div className="w-[35%] text-right text-red-400">
                          1555.710
                        </div>
                        <div className="w-[35%] text-right text-red-400">
                          262.02
                        </div>
                        <div className="w-[30%] text-right text-stone-400">
                          1:27:46
                        </div>
                      </div>
                    </div>
                  </Scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SwapPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default SwapPage;
