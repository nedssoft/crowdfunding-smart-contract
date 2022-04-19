import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Stack,
  Input,
  FormControl,
  FormLabel,
  Button,
  Flex,
  Skeleton,
  Text,
  useClipboard,
  Box,
} from '@chakra-ui/react';
import CampaignManager from './contracts/CampaignManager.json';

import getWeb3 from './getWeb3';

export default function App_() {
  const [web3, setWeb3] = useState(null);
  const accounts = useRef(null);
  const contracts = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [state, setState] = useState({
    campaignName: '',
    campaignId: '',
  });
  const { hasCopied, onCopy } = useClipboard(contractAddress);
  const [campaignAddress, setCampaignAddress] = useState('');
  useEffect(() => {
    (async () => {
      const web3 = await getWeb3();
      setWeb3(web3);
      const _accounts = await web3.eth.getAccounts();
      accounts.current = _accounts;
      const networkId = await web3.eth.net.getId();
      const managerInstance = new web3.eth.Contract(
        CampaignManager.abi,
        CampaignManager.networks[networkId] &&
          CampaignManager.networks[networkId].address,
      );

      contracts.current = {
        managerInstance,
      };

      if (managerInstance && _accounts[0]) {
        setContractAddress(CampaignManager.networks[networkId].address);
        setLoaded(true);
      }
    })();
  }, []);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (contracts && contracts.current) {
      const results = await contracts.current.managerInstance.methods
        .createCampaign(state.campaignId, state.campaignName)
        .send({ from: accounts.current[0] });

      console.log({ results });
      if (results && results.events.CampaignCreated.returnValues) {
        setCampaignAddress(
          results.events.CampaignCreated.returnValues.campaignAddress,
        );
      }
    }
  };
  return (
    <Container mt="50px" background="">
      {!loaded && (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
      {loaded && (
        <Stack justify="center" align="center" mt="100px">
          {campaignAddress && (
            <Text fontWeight="bold">
              Campaign Address: {campaignAddress}{' '}
              <Button onClick={onCopy} as="span">
                {hasCopied ? 'Copied' : 'Copy'}
              </Button>
            </Text>
          )}
          <Text fontWeight="bold">Create Campaign</Text>
          <FormControl as="fieldset">
            <Flex flexDir="column">
              <FormLabel htmlFor="campaignName">Campaign Name</FormLabel>
              <Input
                id="campaignName"
                type="text"
                mb="10px"
                name="campaignName"
                onChange={handleInputChange}
              />
              <FormLabel htmlFor="campaignName">Campaign ID</FormLabel>
              <Input
                id="campaignId"
                type="text"
                mb="10px"
                name="campaignId"
                onChange={handleInputChange}
              />
              <Button mt="10px" onClick={handleCreateCampaign}>
                Submit
              </Button>
            </Flex>
          </FormControl>
        </Stack>
      )}
    </Container>
  );
}
