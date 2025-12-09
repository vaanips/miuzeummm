import os
import time
import requests
from urllib.parse import unquote, urlparse
from PIL import Image

OUTPUT_ROOT = "museum_images"
WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {"User-Agent": "MuseumImageDownloader/1.0 (contact: srane3094@gmail.com)"}

MAX_IMAGES_PER_MUSEUM = 11
MIN_WIDTH = 200
MIN_HEIGHT = 200
SLEEP = 0.2

CREATE_THUMBNAILS = True
THUMBNAIL_SIZE = (240, 160)

MANUAL_CATEGORIES = {
    # "Indian_Museum_Kolkata": [
    #     "Category:Indian Museum, Kolkata",
    #     "Category:Interior of the Indian Museum, Kolkata"
    # ],
    # "Victoria_Memorial_Kolkata": [
    #     "Category:Victoria Memorial, Kolkata",
    #     "Category:Victoria Memorial interior"
    # ],
    # "National_Museum_New_Delhi": [
    #     "Category:National Museum, New Delhi",
    #     "Category:Interior of the National Museum, New Delhi"
    # ],
    # "National_Gallery_of_Modern_Art_New_Delhi": [
    #     "Category:National Gallery of Modern Art, New Delhi",
    #     "Category:NGMA New Delhi"
    # ],
    # "Chhatrapati_Shivaji_Maharaj_Vastu_Sangrahalaya_Mumbai": [
    #     "Category:Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    #     "Category:CSMVS Mumbai"
    # ],
    # "Salar_Jung_Museum_Hyderabad": [
    #     "Category:Salar Jung Museum",
    #     "Category:Collections of the Salar Jung Museum"
    # ],
    # "Government_Museum_Chennai": [
    #     "Category:Government Museum, Chennai"
    # ],
    # "National_Museum_of_Indian_Cinema_Mumbai": [
    #     "Category:National Museum of Indian Cinema"
    # ],
    # "Nehru_Science_Centre_Mumbai": [
    #     "Category:Nehru Science Centre"
    # ],
    # "Goa_Chitra_Museum_Benaulim": [
    #     "Category:Goa Chitra Museum"
    # ],
    # "Government_Museum_Bengaluru": [
    #     "Category:Government Museum, Bengaluru"
    # ],
    # "Government_Museum_Chennai_Art_History": [
    #     "Category:Government Museum, Chennai"
    # ],
    # "Albert_Hall_Museum_Jaipur": [
    #     "Category:Albert Hall Museum",
    #     "Category:Interior of the Albert Hall Museum"
    # ],
    # "Kerala_Museum_Ernakulam": [
    #     "Category:Kerala Museum"
    # ],
    # "Bihar_Museum_Patna": [
    #     "Category:Bihar Museum"
    # ],
    # "House_of_Jagat_Seth_Museum_Murshidabad": [
    #     "Category:House of Jagat Seth Museum"
    # ],
    # "Dr_MGR_Memorial_House_Chennai": [
    #     "Category:Dr. MGR Memorial House"
    # ],
    # "Godly_Museum_Mysore": [
    #     "Category:Godly Museum"
    # ],
    # "Vishwam_Museum_Mysore": [
    #     "Category:Vishwam Museum"
    # ],
    # "Regional_Museum_of_Natural_History_Mysore": [
    #     "Category:Regional Museum of Natural History, Mysuru"
    # ],
    # "Ram_Gauri_Sangrahalay_Gangtok": [
    #     "Category:Ram Gauri Sangrahalay"
    # ],
    # "Jehangir_Art_Gallery_Mumbai": [
    #     "Category:Jehangir Art Gallery"
    # ],
    # "Kiran_Nadar_Museum_of_Art_New_Delhi": [
    #     "Category:Kiran Nadar Museum of Art, New Delhi"
    # ],
    # "Kiran_Nadar_Museum_of_Art_Noida": [
    #     "Category:Kiran Nadar Museum of Art, Noida"
    # ],
    # "Triveni_Kala_Sangam_New_Delhi": [
    #     "Category:Triveni Kala Sangam"
    # ],
    # "Narrow_Gauge_Rail_Museum_Nagpur": [
    #     "Category:Narrow Gauge Rail Museum"
    # ],
    # "Central_Museum_Nagpur": [
    #     "Category:Central Museum, Nagpur"
    # ],
    # "Anthropological_Museum_Seminary_Hills_Nagpur": [
    #     "Category:Anthropological Museum, Nagpur"
    # ],
    # "Shantivan_Ambedkar_Museum_Nagpur": [
    #     "Category:Shantivan Ambedkar Museum"
    # ],
    # "Mysore_Picture_Gallery": [
    #     "Category:Mysore Picture Gallery"
    # ],
    # "Textile_Museum_Ahmedabad": [
    #     "Category:Textile Museum, Ahmedabad"
    # ],
    # "Toilet_Museum_New_Delhi": [
    #     "Category:Sulabh International Museum of Toilets"
    # ],
    # "House_of_Jagat_Seth_Museum_Murshidabad": [
    #     "Category:Jagat Seth House (Murshidabad)",  # 70+ files
    # ],

    # # Dr_MGR_Memorial_House_Chennai
    # # You used: "Category:Dr. MGR Memorial House"
    # "Dr_MGR_Memorial_House_Chennai": [
    #     "Category:MGR Memorial House",             # 4 files
    # ],

    # # Regional_Museum_of_Natural_History_Mysore
    # # You used: "Category:Regional Museum of Natural History, Mysuru"
    # "Regional_Museum_of_Natural_History_Mysore": [
    #     "Category:Regional Museum of Natural History, Mysore",  # 4 files
    # ],

    # # Government_Museum_Bengaluru (you only got 1)
    # # You used: "Category:Government Museum, Bengaluru"
    # "Government_Museum_Bengaluru": [
    #     "Category:Government Museum (Bangalore)",  # 150+ files
    # ],

    # # Narrow_Gauge_Rail_Museum_Nagpur
    # # You used: "Category:Narrow Gauge Rail Museum" (no such cat)
    # "Narrow_Gauge_Rail_Museum_Nagpur": [
    #     "Category:Railway museums in India",
    #     "Category:Visitor attractions in Nagpur",
    # ],

    # # Central_Museum_Nagpur – only 1 file on Commons, in a generic city cat
    # "Central_Museum_Nagpur": [
    #     "Category:Nagpur",
    # ],

    # # Textile_Museum_Ahmedabad – this is the Calico Museum of Textiles
    # "Textile_Museum_Ahmedabad": [
    #     "Category:Calico Museum of Textiles",
    # ],

    # # Toilet_Museum_New_Delhi – Sulabh International Museum of Toilets
    # "Toilet_Museum_New_Delhi": [
    #     "Category:Sulabh International",
    #     "Category:Public toilets in India",
    # ],

    # # Triveni Kala Sangam – only one image, lives in generic categories
    # "Triveni_Kala_Sangam_New_Delhi": [
    #     "Category:Art galleries in India",
    #     "Category:Buildings in New Delhi",
    # ],

    # # Kiran Nadar Museum of Art – there is no museum category,
    # # but there *are* images in the person category
    # "Kiran_Nadar_Museum_of_Art_New_Delhi": [
    #     "Category:Kiran Nadar",
    # ],
    # "Kiran_Nadar_Museum_of_Art_Noida": [
    #     "Category:Kiran Nadar",
    # ],

    # # Vishwam Museum Mysore – appears only on a commemorative stamp
    # "Vishwam_Museum_Mysore": [
    #     "Category:2018 stamps of India",
    #     "Category:My Stamp",
    # ],

    # # --- categories with subcategories (you got < 11, but more are available) ---

    # # CSMVS – you only got BISM.jpg because almost everything is in subcats
    # "Chhatrapati_Shivaji_Maharaj_Vastu_Sangrahalaya_Mumbai": [
    #     "Category:Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    #     "Category:Exterior of Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    #     "Category:Interior of Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    #     "Category:Collections in the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    # ],

    # # NGMA New Delhi – you already have two good cats, add the higher-level ones
    # "National_Gallery_of_Modern_Art_New_Delhi": [
    #     "Category:National Gallery of Modern Art, India",
    #     "Category:Paintings in the National Gallery Of Modern Art, New Delhi",
    #     "Category:National Gallery of Modern Art, New Delhi",
    #     "Category:NGMA New Delhi",
    # ],
    #  "Museum_of_Everyday_Things_Delhi": [
    #     "Category:Museum of Everyday Things"
    # ],
    # "Bunker_Museum_Mumbai": [
    #     "Category:Bunker Museum Mumbai"
    # ],
    # "Nehru_Planetarium_Museum_New_Delhi": [
    #     "Category:Nehru Planetarium, New Delhi"
    # ],
    # "Jallianwala_Bagh_National_Memorial_Amritsar": [
    #     "Category:Jallianwala Bagh National Memorial"
    # ],
    # "Partition_Museum_Amritsar": [
    #     "Category:Partition Museum, Amritsar"
    # ],
    # "Punjab_State_War_Heroes_Memorial_Museum_Amritsar": [
    #     "Category:Punjab State War Heroes Memorial and Museum"
    # ],
    # "Jallianwala_Bagh_National_Memorial_Amritsar": [
    #     "Category:Jallianwala Bagh",
    #     "Category:Jallianwala Bagh National Memorial, Amritsar",
    #     "Category:Jallianwala Bagh massacre memorial",
    # ]

    # ------------------------------------------------------------------------
    # 2) Museum of Everyday Things — files exist under crafts/design, NOT museum tag
    #    No direct category — fallback to related parent/personal category
    # ------------------------------------------------------------------------
    # "Museum_of_Everyday_Things_Delhi": [
    #     "Category:Everyday objects in India",
    #     "Category:Design museums in India",
    #     "Category:Art and craft in India",
    #     "Category:Delhi",                 # fallback source, use filter later
    # ],

    # # ------------------------------------------------------------------------
    # # 3) Bunker Museum Mumbai — located inside Raj Bhavan, no official museum category
    # # ------------------------------------------------------------------------
    # "Bunker_Museum_Mumbai": [
    #     "Category:Raj Bhavan, Mumbai",
    #     "Category:Mumbai",
    #     "Category:Indian Army bunkers",
    # ],

    # # ------------------------------------------------------------------------
    # # 4) Punjab State War Heroes Memorial & Museum, Amritsar
    # #    Exists under different category format
    # # ------------------------------------------------------------------------
    # "Punjab_State_War_Heroes_Memorial_Museum_Amritsar": [
    #     "Category:Punjab State War Heroes Memorial & Museum",
    #     "Category:Punjab State War Heroes Memorial and Museum, Amritsar",
    #     "Category:War memorials in Punjab",
    #     "Category:Amritsar",
    # ]
    # "Nihal_Singh_Statue_and_Museum_Muktsar": [
    #     "Category:Nihal Singh Museum"
    # ]

    # …your existing entries…

    # Gandhi Smarak Sangrahalaya, Patna
    # Uses the general Bihar museums & Patna buildings categories;
    # this is where the file "Gandhi Sangralaya Patna.jpg" lives. :contentReference[oaicite:0]{index=0}
    "Gandhi_Smarak_Sangrahalaya_Patna": [
        "Category:Museums in Bihar",
        "Category:Buildings in Patna",
    ],

    # Saptaparni Cave “museum” – the real Commons category is for the cave itself,
    # named Sattapanni Cave. :contentReference[oaicite:1]{index=1}
    "Saptaparni_Cave_Archeological_Museum_Bodh_Gaya": [
        "Category:Sattapanni Cave",
        "Category:Rajgir hills",
    ],

    # No actual Fukuoka Peace Museum in Patna on Commons – nothing to map to.
    # Leave this empty so your script just logs 0 images and moves on.
    "Fukuoka_Peace_Museum_Patna": [
        # no suitable Commons category or files found
    ],

    # Madhubani Art Museum – closest match is generic Madhubani art category. :contentReference[oaicite:2]{index=2}
    "Madhubani_Art_Museum_Madhubani": [
        "Category:Art of Madhubani",
    ]

}


def make_folder(path):
    os.makedirs(path, exist_ok=True)

def get_filename_from_url(url):
    path = urlparse(url).path
    return unquote(os.path.basename(path))

def api_call(params):
    try:
        r = requests.get(WIKIMEDIA_API, params=params, headers=HEADERS, timeout=30)
        r.raise_for_status()
        return r
    except:
        return None

def get_category_files(category_title, limit=50, next_token=None):
    params = {
        "action": "query",
        "format": "json",
        "list": "categorymembers",
        "cmtitle": category_title,
        "cmnamespace": 6,
        "cmlimit": limit
    }
    if next_token:
        params["cmcontinue"] = next_token

    r = api_call(params)
    if not r:
        return [], None

    data = r.json()
    members = data.get("query", {}).get("categorymembers", [])
    next_token = data.get("continue", {}).get("cmcontinue")
    return members, next_token

def get_image_info(titles):
    if not titles:
        return []

    params = {
        "action": "query",
        "format": "json",
        "titles": "|".join(titles),
        "prop": "imageinfo",
        "iiprop": "url|size|mime"
    }

    r = api_call(params)
    if not r:
        return []

    data = r.json()
    pages = data.get("query", {}).get("pages", {})
    output = []

    for page_id, page in pages.items():
        info = page.get("imageinfo")
        if info:
            img = info[0]
            output.append({
                "title": page.get("title"),
                "url": img.get("url"),
                "width": img.get("width", 0),
                "height": img.get("height", 0)
            })

    return output

def download_image(url, save_path):
    try:
        with requests.get(url, stream=True, headers=HEADERS, timeout=60) as r:
            r.raise_for_status()
            temp = save_path + ".part"
            with open(temp, "wb") as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            os.replace(temp, save_path)
        return True
    except:
        if os.path.exists(save_path + ".part"):
            os.remove(save_path + ".part")
        return False

def create_thumbnail(image_path, thumb_path):
    try:
        img = Image.open(image_path)
        img.thumbnail(THUMBNAIL_SIZE)
        img.save(thumb_path, "JPEG", quality=80)
    except:
        pass

def download_for_museum(museum_name, categories):
    print("\nDownloading for:", museum_name)

    museum_folder = os.path.join(OUTPUT_ROOT, museum_name)
    thumb_folder = os.path.join(museum_folder, "thumbnails")

    make_folder(museum_folder)
    if CREATE_THUMBNAILS:
        make_folder(thumb_folder)

    downloaded = 0
    used_urls = set()

    for category in categories:
        if downloaded >= MAX_IMAGES_PER_MUSEUM:
            break

        print("  Category:", category)
        next_token = None

        while downloaded < MAX_IMAGES_PER_MUSEUM:
            members, next_token = get_category_files(category, next_token=next_token)
            if not members:
                break

            titles = [m["title"] for m in members]
            images = get_image_info(titles)

            for img in images:
                if downloaded >= MAX_IMAGES_PER_MUSEUM:
                    break

                url = img["url"]
                w = img["width"]
                h = img["height"]

                if not url or url in used_urls:
                    continue

                if w < MIN_WIDTH or h < MIN_HEIGHT:
                    continue

                file_name = get_filename_from_url(url)
                save_path = os.path.join(museum_folder, file_name)

                if os.path.exists(save_path):
                    base, ext = os.path.splitext(file_name)
                    n = 1
                    while os.path.exists(os.path.join(museum_folder, f"{base}_{n}{ext}")):
                        n += 1
                    save_path = os.path.join(museum_folder, f"{base}_{n}{ext}")

                print("    Downloading:", file_name)

                ok = download_image(url, save_path)
                if ok:
                    used_urls.add(url)
                    downloaded += 1

                    if CREATE_THUMBNAILS:
                        thumb_name = os.path.splitext(os.path.basename(save_path))[0] + ".jpg"
                        thumb_path = os.path.join(thumb_folder, thumb_name)
                        create_thumbnail(save_path, thumb_path)

                time.sleep(SLEEP)

            if not next_token:
                break

            time.sleep(SLEEP)

    print("  Total downloaded:", downloaded)

def main():
    make_folder(OUTPUT_ROOT)

    for museum, categories in MANUAL_CATEGORIES.items():
        download_for_museum(museum, categories)

    print("\nDownload completed. Check museum_images folder.")

if __name__ == "__main__":
    main()
