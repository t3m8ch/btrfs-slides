import {makeProject} from '@motion-canvas/core';

import welcome from './scenes/welcome?scene';
import sectors from './scenes/sectors?scene';
import copies from './scenes/copies?scene';
import vfs from './scenes/vfs?scene';
import vfsInterface from './scenes/vfs-interface?scene';
import namesAndInodes from './scenes/names-and-inodes?scene';
import btreeSearch from './scenes/btree-search?scene';
import btreeBlocks from './scenes/btree-blocks?scene';
import btreeKeys from './scenes/btree-keys?scene';
import btreeInsert from './scenes/btree-insert?scene';
import btreeObjects from './scenes/btree-objects?scene';
import btreePacking from './scenes/btree-packing?scene';
import addressSpaces from './scenes/address-spaces?scene';
import chunkMapping from './scenes/chunk-mapping?scene';
import superblock from './scenes/superblock?scene';
import filesystemTrees from './scenes/filesystem-trees?scene';
import fsTreeItems from './scenes/fs-tree-items?scene';
import pathLookup from './scenes/path-lookup?scene';
import readFile from './scenes/read-file?scene';
import copyOnWrite from './scenes/copy-on-write?scene';
import reflink from './scenes/reflink?scene';
import subvolumeSnapshot from './scenes/subvolume-snapshot?scene';
import extentRefcounts from './scenes/extent-refcounts?scene';
import extentBackrefs from './scenes/extent-backrefs?scene';
import spaceAllocation from './scenes/space-allocation?scene';
import blockGroupTypes from './scenes/block-group-types?scene';
import checksums from './scenes/checksums?scene';
import transactions from './scenes/transactions?scene';
import transactionBatching from './scenes/transaction-batching?scene';
import fsync from './scenes/fsync?scene';
import writeRecap from './scenes/write-recap?scene';
import thanks from './scenes/thanks?scene';

export default makeProject({
  scenes: [welcome, sectors, copies, vfs, vfsInterface, namesAndInodes,
    btreeSearch, btreeBlocks, btreeKeys, btreeInsert, btreeObjects, btreePacking,
    addressSpaces, chunkMapping, superblock, filesystemTrees, fsTreeItems, pathLookup, readFile, copyOnWrite, reflink, subvolumeSnapshot, extentRefcounts, extentBackrefs, transactionBatching, transactions, blockGroupTypes, spaceAllocation, checksums, writeRecap, fsync, thanks],
});
