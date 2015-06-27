'use strict';

function applyMaxOccupationPercentage (candidates, blocksMaxOccupationPercentage, mapStatus) {
    return candidates.filter(function hasNotExceededMaxOccupationPercentage (blockId) {
        // if max occupation percentage limit is not defined
        if (!blocksMaxOccupationPercentage.hasOwnProperty(blockId)) {
            return true;
        }
        console.log('percentage of ', blockId, mapStatus.getBlockOccupationPercentage(blockId) < blocksMaxOccupationPercentage[blockId],
        mapStatus.getBlockOccupation(blockId), mapStatus.getNumberOfTotalBlocks());
        return mapStatus.getBlockOccupationPercentage(blockId) < blocksMaxOccupationPercentage[blockId];
    });
}

module.exports = applyMaxOccupationPercentage;
