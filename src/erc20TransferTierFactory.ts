import { BigInt } from "@graphprotocol/graph-ts"
import {
  Implementation,
  NewChild
} from "../generated/Factories/Factories"
import { ERC20TransferTierFactory, ERC20TransferTier } from "../generated/schema"

export function handleImplementation(event: Implementation): void {
  let factory = new ERC20TransferTierFactory(event.address.toHex());
  factory.childrenCount = BigInt.fromI32(0);
  factory.implementation = event.params.implementation;
  factory.save();
}

export function handleNewChild(event: NewChild): void {
  let factory = ERC20TransferTierFactory.load(event.address.toHex());
  if(factory){
    let verify = new ERC20TransferTier(event.params.child.toHex());
    verify.deployBlock = event.block.number;
    verify.deployTimestamp = event.block.timestamp;
    verify.deployer = event.params.sender;
    verify.factory = factory.id;
    verify.save();

    factory.childrenCount = factory.childrenCount.plus(BigInt.fromI32(1));
    factory.save()
  }
}
