'use strict';

function applyMaxOccupationPercentage (candidates, blocksMaxOccupationPercentage, mapStatus) {
    return candidates.filter(function hasNotExceededMaxOccupationPercentage (blockId) {
        // if max occupation percentage limit is not defined
        if (!blocksMaxOccupationPercentage.hasOwnProperty(blockId)) {
            return true;
        }
        return mapStatus.getBlockOccupationPercentage(blockId) < blocksMaxOccupationPercentage[blockId];
    });
}

module.exports = applyMaxOccupationPercentage;
