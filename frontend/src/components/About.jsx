import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Globe, Music, Book, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hskzjb5m_image.png" 
              alt="First Lutheran Church of Miami Logo" 
              className="h-20 w-20 md:h-24 md:w-24 object-contain filter drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            About First Lutheran Church of Miami
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Celebrating diversity in worship, music, and teaching. A welcoming community serving Miami for over 1¼ years.
          </p>
        </div>

        {/* Pastor James Feature */}
        <div className="mb-16">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <img
                  src="https://voyagemia.com/wp-content/uploads/2025/02/c-1739001069779-personal_1739001564590_1739001564590_pastorjames_dunham_pastor-james-santiago-dunham-first-lutheran-church-of-miami-1-1.jpg"
                  alt="Pastor James (Santiago) Dunham"
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-center lg:text-left">
                  <CardTitle className="text-4xl font-bold mb-4">Pastor James (Santiago) Dunham</CardTitle>
                  <CardDescription className="text-blue-100 text-lg mb-4">
                    MDIV • 25+ Years Experience • Multilingual Ministry Leader
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">14 Languages</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">20+ Years Teaching</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Family Counseling</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Pastor James (Santiago) Dunham has been teaching classes in fourteen (14) different languages for over 20 years. 
                  He celebrates diversity in music, teaching, and worship programs, offering music from our talented musicians to 
                  the Miami community. Pastor James teaches music and provides spiritual guidance in Spanish, French, Hebrew, Greek, 
                  Portuguese, Mandarin Chinese, Japanese, Italian, German, Hindi, Indonesian, Vietnamese, Russian, Urdu, English, 
                  and small elements of ASL sign language to precious deaf children.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Having served communities in Washington state, Michigan (where he helped build a new church), Los Angeles, CA, 
                  and Hermosillo, Sonora, Mexico, Pastor James brings a wealth of experience in cross-cultural ministry. 
                  He has a particular passion for serving the Latina Community, having taught in Los Angeles and Mexico for 8 years.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Pastor James has been counseling children and families for over 20 years, bringing compassion, wisdom, and 
                  multilingual capabilities to his pastoral care ministry.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Church Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Programs & Ministry</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center p-6">
                <Globe className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-xl">14-Language Classes</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-600 text-center mb-4">
                  Comprehensive language instruction including Spanish, French, Hebrew, Greek, Portuguese, 
                  Mandarin Chinese, Japanese, Italian, German, Hindi, Indonesian, Vietnamese, Russian, Urdu, and ASL.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center p-6">
                <Music className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-xl">Music Ministry</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-600 text-center mb-4">
                  World-class musical events and recitals featuring our talented musicians, 
                  including our gifted Music Director and accomplished vocalists.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center p-6">
                <Book className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-xl">Education Center</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-600 text-center mb-4">
                  Opening September 2025: International learning center with preschool/dayschool, 
                  creative arts, and multilingual education programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community & Leadership */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Community & Leadership</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600" />
                  Board of Directors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Billy Rudnick</h4>
                    <p className="text-gray-600 text-sm">Children's author of three books including "The Miraculous Conchell"</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ernesto Capoche (27)</h4>
                    <p className="text-gray-600 text-sm">Beloved Evangelism Director</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manny Cordoves Jr. (21) & Angie Castaneda (22)</h4>
                    <p className="text-gray-600 text-sm">Young leadership representing our diverse community</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Eric Williams - Advisory Role</h4>
                    <p className="text-gray-600 text-sm">CEO of LocalPosh, serving Miami's 55+ senior communities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Award className="h-6 w-6 mr-2 text-blue-600" />
                  Talented Musicians
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Miss Anastasia Leech (27)</h4>
                    <p className="text-gray-600 text-sm">Exceptionally gifted vocalist and artist, leading worship as cantor with "the voice of an angel"</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Captain David Whitten</h4>
                    <p className="text-gray-600 text-sm">Cantor, world traveler, and beloved community member</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Winston & Quiqui Leech</h4>
                    <p className="text-gray-600 text-sm">Winston: Multi-talented member; Quiqui: Amazing fashion designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Photos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="relative">
              <img
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/r8r2porw_Our%20partner%2C%20Localposh%20CEO%2C%20Eric%20Williams%20and%20family%21.JPG"
                alt="Eric Williams and family - LocalPosh CEO and church partner"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm font-medium">Eric Williams & Family - LocalPosh CEO</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hmet117m_Pastor%20James%20with%20Serena%20and%20Boris.jpg"
                alt="Pastor James with Serena and Boris"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm font-medium">Pastor James with Serena and Boris</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/x121373s_Yay%21%201st%20Easter%20at%20FLC.JPG"
                alt="First Easter celebration at First Lutheran Church"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm font-medium">First Easter Celebration at FLC</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://voyagemia.com/wp-content/uploads/2025/02/c-1738772100241-1738772595018_pastorjames_dunham_pastor-james-and-children-we-open-our-school-in-september-of-2025-1.jpg"
                alt="Pastor James with children for the upcoming school"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm font-medium">Pastor James with children - School opens September 2025</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://voyagemia.com/wp-content/uploads/2025/02/c-1739001212399-1739001707416_pastorjames_dunham_pastor-james-podcast-leader-manny-cordoves-jr-evangelism-director-ernesto-capoche-and-multi-talented-winston-leech-at-first-lutheran-1.jpg"
                alt="Church leadership team"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm font-medium">Church Leadership Team</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/7thu1fea_Our%20beloved%20IT%20expert%2C%20John%20Riley%20and%20Pastor%20James.png"
                alt="Our beloved IT expert John Riley and Pastor James"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <p className="text-sm font-medium">John Riley (IT Expert) & Pastor James</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-6 text-blue-200" />
                <h2 className="text-3xl font-bold mb-6">Our Mission & Beliefs</h2>
                <div className="max-w-4xl mx-auto space-y-4 text-lg">
                  <p className="text-blue-100">
                    First Lutheran Church of Miami is a "No judgment zone" - welcoming all people and ethnicities with 100% open hearts and 100% open arms! 
                    We hold strongly to Holy Scripture as "inerrant" (without errors) and believe in the birth, substitutionary death, and resurrection of Jesus Christ.
                  </p>
                  <p className="text-blue-100">
                    We are deeply committed to the Great Commission of our Lord Jesus to "take the Gospel to all nations." 
                    Celebrating 1¼ years of ministry in Miami, we continue to serve our diverse community with love, compassion, and excellence.
                  </p>
                  <p className="text-blue-100 font-semibold">
                    "YOU are LOVED here!" - Pastor James Dunham
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-600">1770 Brickell Avenue<br />Miami, FL 33129</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Pastor James</h3>
                  <p className="text-gray-600">pastorjamesdunham@gmail.com<br />(313) 670-3830</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Worship Schedule</h3>
                  <p className="text-gray-600">Sunday Worship: 1:00-2:00 PM<br />Bible Classes: 2:00-2:45 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;