import React, { Component } from 'react';
import SectionPanel from '../../components/UI/sectionPanel';
import Translate from '../../translate';

class Page extends Component {
  render() {
    return (
      <div className="container margin_bottom_138">
        <p>&nbsp;</p>
        <SectionPanel title="CONTACT_US">
          <section className="pt-1">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="map">
                    <div className="map-part">
                      <div id="map" className="map-inner-part" />
                    </div>
                    <iframe
                      title="Google Maps"
                      src="https://maps.google.com/maps?q=Gazar.am&t=&z=17&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="200"
                      frameBorder="0"
                      style={{ border: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="pt-70 client-main align-center">
            <div className="container">
              <div className="contact-info">
                <div className="row m-0">
                  <div className="col-md-4 p-0">
                    <div className="contact-box">
                      <div className="contact-icon contact-phone-icon" />
                      <span>
                        <b><Translate W="PHONE_NUMBER"/></b>
                      </span>
                      <p><a href="tel:+37455456454">055 456 454</a></p>
                    </div>
                  </div>
                  <div className="col-md-4 p-0">
                    <div className="contact-box">
                      <div className="contact-icon contact-mail-icon" />
                      <span>
                        <b><Translate W="EMAIL"/></b>
                      </span>
                      <p><a href="mailto:info@gazar.am">info@gazar.am</a></p>
                    </div>
                  </div>
                  <div className="col-md-4 p-0">
                    <div className="contact-box">
                      <div className="contact-icon contact-open-icon" />
                      <span>
                        <b><Translate W="ADDRESS"/></b>
                      </span>
                      <p><Translate W="GAZARAM-ADDRESS"/></p>
                      <p><Translate W="MONDAY"/> – <Translate W="FRIDAY"/> 9:00 – 18:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SectionPanel>
      </div>
    );
  }
}

export default Page;
