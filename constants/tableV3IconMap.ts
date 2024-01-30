import AirplaneTours from 'assets/airplaneTours';
import AirportTransfer from 'assets/airportTransfer';
import Beaches from 'assets/beaches';
import BikesAndSegway from 'assets/bikesAndSegway';
import Cabarets from 'assets/cabarets';
import CableCar from 'assets/cableCar';
import Camping from 'assets/camping';
import City from 'assets/city';
import CityPasses from 'assets/cityPasses';
import ClassCRV from 'assets/classCRV';
import CoffeeAndTea from 'assets/coffeeAndTea';
import Combos from 'assets/combos';
import ComingSoon from 'assets/comingSoon';
import CookingClasses from 'assets/cookingClasses';
import Cruises from 'assets/cruises';
import CruiseTickets from 'assets/cruiseTickets';
import DanceClasses from 'assets/danceClasses';
import DiningAndExperiences from 'assets/diningAndExperiences';
import EveningCruises from 'assets/eveningCruises';
import ExternalLink from 'assets/externalLink';
import FoodAndDrink from 'assets/foodAndDrink';
import FoodPasses from 'assets/foodPasses';
import FoodTours from 'assets/foodTours';
import GuidedTours from 'assets/guidedTours';
import HelicopterTours from 'assets/helicopterTours';
import HopOnHopOffTours from 'assets/hopOnHopOffTours';
import HotAirBalloons from 'assets/hotAirBalloons';
import Landmarks from 'assets/landmarks';
import MultiDayTours from 'assets/multiDayTours';
import Musicals from 'assets/musicals';
import NationalParks from 'assets/nationalParks';
import ObservationDecks from 'assets/observationDecks';
import Opera from 'assets/opera';
import Parks from 'assets/parks';
import PhotographyClasses from 'assets/photographyClasses';
import PhotographyTours from 'assets/photographyTours';
import Plays from 'assets/plays';
import Plus from 'assets/plus';
import PrivateTours from 'assets/privateTours';
import PubCrawls from 'assets/pubCrawls';
import Quadbking from 'assets/quadbking';
import Racing from 'assets/racing';
import ReligiousSites from 'assets/religiousSites';
import Sandboarding from 'assets/sandboarding';
import Shopping from 'assets/shopping';
import Snorkeling from 'assets/snorkeling';
import Sports from 'assets/sports';
import Surfing from 'assets/surfing';
import ThemeParks from 'assets/themeParks';
import TrainPasses from 'assets/trainPasses';
import Transportation from 'assets/transportation';
import TravelInsurance from 'assets/travelInsurance';
import WalkingTours from 'assets/walkingTours';
import WaterParks from 'assets/waterParks';
import WifiAndSimCards from 'assets/wifiAndSimCards';
import Wineries from 'assets/wineries';
import YachtTours from 'assets/yachtTours';
import ZooAndAquarium from 'assets/zooAndAquarium';

export const TABLE_V3_SVG_MAPPING: Record<any, JSX.Element> = {
  plus: Plus(),
  'external link': ExternalLink(),
  musicals: Musicals(),
  plays: Plays(),
  opera: Opera(),
  sports: Sports(),
  cabarets: Cabarets(),
  'helicopter tours': HelicopterTours(),
  'hot air balloon': HotAirBalloons(),
  'airplane tours': AirplaneTours(),
  'theme parks': ThemeParks(),
  'zoos and aquarium': ZooAndAquarium(),
  parks: Parks(),
  'water parks': WaterParks(),
  'religious sites': ReligiousSites(),
  landmarks: Landmarks(),
  'city passes': CityPasses(),
  'observation decks': ObservationDecks(),
  'train passes': TrainPasses(),
  'walking tours': WalkingTours(),
  'guided tours': GuidedTours(),
  'hop on hop off tours': HopOnHopOffTours(),
  'private tours': PrivateTours(),
  'bikes and segway': BikesAndSegway(),
  shopping: Shopping(),
  'multi day tours': MultiDayTours(),
  'photography tours': PhotographyTours(),
  'cruise tickets': CruiseTickets(),
  snorkeling: Snorkeling(),
  surfing: Surfing(),
  'yacht tours': YachtTours(),
  racing: Racing(),
  sandboarding: Sandboarding(),
  'class c rvs': ClassCRV(),
  'cable car': CableCar(),
  'food and drink': FoodAndDrink(),
  'dining experiences': DiningAndExperiences(),
  'food tours': FoodTours(),
  'cooking classes': CookingClasses(),
  wineries: Wineries(),
  'coffee and tea': CoffeeAndTea(),
  'pub crawls': PubCrawls(),
  'food passes': FoodPasses(),
  city: City(),
  beaches: Beaches(),
  'national parks': NationalParks(),
  combos: Combos(),
  'coming soon': ComingSoon(),
  transportation: Transportation(),
  'airport transfers': AirportTransfer(),
  quadbking: Quadbking(),
  'wifi and sim cards': WifiAndSimCards(),
  'travel insurance': TravelInsurance(),
  'photography classes': PhotographyClasses(),
  'dance classes': DanceClasses(),
  camping: Camping(),
  cruises: Cruises(),
  'evening cruises': EveningCruises(),
};
