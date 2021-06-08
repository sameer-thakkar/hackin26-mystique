import {
  isBitSet,
  numberOfSetBits as numberOfSetBitsfromIntegerUtils,
} from '../integerUtils';
import { hashCode } from '../gen';

class Experiment {
  experimentName: string;
  bucketName: string;
  bucketWeight: number;

  checkAssertion(condition, error) {
    if (!condition) {
      throw new Error(error);
    }
  }

  constructor(experimentName, bucketName, bucketWeight) {
    this.checkAssertion(
      bucketName.length === bucketWeight.length,
      'buckets size should match'
    );
    this.experimentName = experimentName;
    this.bucketName = bucketName;
    this.bucketWeight = bucketWeight;
  }

  getHsidHashValueForExperiment(hsidHash, experimentName) {
    let hsidHashForExperiment = 0;
    const experimentHash = hashCode(experimentName);

    for (let i = 0, j = 0; i < 32; ++i) {
      if (isBitSet(experimentHash, i)) {
        if (isBitSet(hsidHash, i)) {
          hsidHashForExperiment |= 1 << j;
        }
        j += 1;
      }
    }
    hsidHashForExperiment += 1;

    return hsidHashForExperiment;
  }

  range(bitCount) {
    return 1 << bitCount;
  }

  bucketCount() {
    return this.bucketName.length;
  }

  resolveBucketIndex(hsidValueForExperiment, hsidValueRange) {
    let index = -1;
    const len = this.bucketName.length;
    let sumBucketweight = 0;
    let cumBucketweight = 0;
    for (let i = 0; i < len; ++i) {
      sumBucketweight += this.bucketWeight[i];
    }

    for (let i = 0; i < len; ++i) {
      cumBucketweight += this.bucketWeight[i];
      if (
        cumBucketweight * hsidValueRange >=
        hsidValueForExperiment * sumBucketweight
      ) {
        index = i;
        break;
      }
    }

    return index;
  }

  getBucket(uniqueId) {
    let bucket = this.bucketName[0];
    if (uniqueId !== null) {
      const hsidString = btoa(uniqueId);
      const hsidHash = hashCode(hsidString);
      const numberOfSetBits = numberOfSetBitsfromIntegerUtils(
        hashCode(this.experimentName)
      );
      const hsidValueRange = this.range(numberOfSetBits);

      const hsidValueForExperiment = this.getHsidHashValueForExperiment(
        hsidHash,
        this.experimentName
      );

      const bucketIndex = this.resolveBucketIndex(
        hsidValueForExperiment,
        hsidValueRange
      );

      if (bucketIndex < 0 || bucketIndex >= this.bucketCount()) {
        const fallbackBucketIndex =
          this.bucketCount() - 1 > 0 ? this.bucketCount() - 1 : 0;
        bucket = this.bucketName[fallbackBucketIndex];

        // Raven.captureMessage(`Experiment ${this.experimentName} : This unique id does not belong to any bucket. Bug. UniqueId : ${uniqueId}`);
      } else {
        bucket = this.bucketName[bucketIndex];
      }
    }
    return bucket;
  }
}

export default Experiment;
