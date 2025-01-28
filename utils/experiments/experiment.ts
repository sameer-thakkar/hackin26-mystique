import Cookies from 'js-cookie';
import { hashCode } from 'utils/gen';
import {
  isBitSet,
  numberOfSetBits as numberOfSetBitsfromIntegerUtils,
} from 'utils/integerUtils';
import { getQueryObject } from 'utils/urlUtils';
import { VARIANTS } from 'const/experiments';
import { COOKIE } from 'const/index';

class Experiment {
  experimentName: string;
  bucketName: string[];
  bucketWeight: number[];

  checkAssertion(condition: boolean, error: string) {
    if (!condition) {
      throw new Error(error);
    }
  }

  constructor(
    experimentName: string,
    bucketName: string[],
    bucketWeight: number[]
  ) {
    this.checkAssertion(
      bucketName.length === bucketWeight.length,
      'buckets size should match'
    );
    this.experimentName = experimentName;
    this.bucketName = bucketName;
    this.bucketWeight = bucketWeight;
  }

  getHsidHashValueForExperiment(hsidHash: number, experimentName: string) {
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

  range(bitCount: number) {
    return 1 << bitCount;
  }

  bucketCount() {
    return this.bucketName.length;
  }

  resolveBucketIndex(hsidValueForExperiment: number, hsidValueRange: number) {
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

  getBucket(uniqueId: string | null) {
    const experimentOverride =
      typeof window !== 'undefined'
        ? getQueryObject(window?.location)?.[COOKIE.EXPERIMENT_OVERRIDE] ??
          Cookies.get(COOKIE.EXPERIMENT_OVERRIDE)
        : null;
    let experimentOverrideVariant = null;
    if (
      experimentOverride === VARIANTS.CONTROL ||
      experimentOverride === VARIANTS.TREATMENT
    )
      experimentOverrideVariant = experimentOverride;
    else if (
      typeof experimentOverride === 'string' &&
      experimentOverride.substring(0, 3).toLowerCase() ===
        this.experimentName.substring(0, 3).toLowerCase()
      // Here we are comparing the first 3 letters of the experiment name to the override experiment query
    )
      experimentOverrideVariant = experimentOverride.substring(4);
    if (experimentOverrideVariant) return experimentOverrideVariant;
    let bucket = this.bucketName[0];
    if (uniqueId !== null) {
      const hsidString = atob(uniqueId);
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
