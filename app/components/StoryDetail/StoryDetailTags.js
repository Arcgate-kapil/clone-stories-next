import React from 'react';
import { Link } from 'react-router-dom';
import ListTitle from '../../components/common/ListTitle';
import { useSelector } from 'react-redux';
import CustomStyle from '../common/CustomStyle';

const StoryDetailTags = ({ storyDetail }) => {
  const isHindi = useSelector(state => state.blogs.isHindi);
  const tags = storyDetail.tags.split(',');
  const tagsHindi = storyDetail.tags_hindi?.split(',');

  return (
    <>
      <CustomStyle>{styles}</CustomStyle>
      <div className='row'>
        <div className='col-12 px-3 px-md-5'>
          <ListTitle title={'Tags '} type='small' />
        </div>
      </div>
      <div className='row mb-4'>
        <div className='StoryDetailTags-tags col-12 px-3 px-md-5 d-flex flex-wrap'>
          {tags.map((tag, index) => (
            <Link
              key={index}
              to={`/tags/${tag.trim().toLowerCase().replace(/ /g, '-')}`}
              className='py-2 px-3 border mr-3 mb-2 tags'
            >
              {isHindi && tagsHindi ? tagsHindi[index] : tag}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default StoryDetailTags;

const styles = `
  @media(max-width: 500px) {
    .StoryDetailTags-tags {
      font-size: 12px;
    }
  }
`;