import axios from 'axios';
import img from '../public/6-yarder-skip.jpg'

export const getSkips = async () => {
  try {
    const res = await axios.get(
      'https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft'
    );

    const skips = res.data.map(skip => ({
      ...skip,
      image: img,
    }));
    return skips;
  } catch (error) {
    console.error("Error fetching skip data:", error);
    return [];
  }
};
