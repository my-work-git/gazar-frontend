import React, { Component } from 'react';
import SectionPanel from '../../components/UI/sectionPanel';
import Translate from '../../translate';

class Page extends Component {
  render() {
    return (
      <div className="container margin_bottom_138">
        <p>&nbsp;</p>
        <SectionPanel title="PRIVACY_POLICY">
          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-8">
              <Translate W="PRIVACY_POLICY_DOCUMENT" />
            </div>
          </div>
        </SectionPanel>
      </div>
    );
  }
}

export default Page;
