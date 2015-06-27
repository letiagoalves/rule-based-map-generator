'use strict';

function applyMaxOccupation (candidates, blocksMaxOccupation, mapStatus) {
    return candidates.filter(function hasNotExceededMaxOccupation (blockId) {
        // if max occupation limit is not defined
        if (!blocksMaxOccupation.hasOwnProperty(blockId)) {
            return true;
        }

        return mapStatus.getBlockOccupation(blockId) < blocksMaxOccupation[blockId];
    });
}

module.exports = applyMaxOccupation;
